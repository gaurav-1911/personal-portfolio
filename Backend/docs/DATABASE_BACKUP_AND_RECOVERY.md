# MongoDB Production Backup, Disaster Recovery & Security Runbook

This document details the production backup strategy, retention policies, restore verification procedures, and least-privilege database user permissions for the MERN Stack Portfolio.

---

## 1. Least-Privilege Database User Permissions

To adhere to the Principle of Least Privilege (PoLP), the portfolio web application must **never** connect to MongoDB with administrative (`root`, `clusterAdmin`, `dbAdminAnyDatabase`) credentials.

### Creation Script (Run once by DBA/Admin)

```javascript
// Connect to MongoDB admin database
use admin;
db.auth("adminUser", "ADMIN_PASSWORD_HERE");

// Switch to the application database
use portfolio_db;

// Create application-specific user with readWrite ONLY on portfolio_db
db.createUser({
  user: "portfolio_app_user",
  pwd: "GENERATE_SECURE_RANDOM_PASSWORD_HERE",
  roles: [
    { role: "readWrite", db: "portfolio_db" }
  ]
});
```

### Connection URI (Stored in Environment Variables)

```bash
# In Backend/.env (Never commit to git!)
MONGODB_URI=mongodb://portfolio_app_user:GENERATE_SECURE_RANDOM_PASSWORD_HERE@localhost:27017/portfolio_db?authSource=portfolio_db&retryWrites=true&w=majority
```

---

## 2. Automated Backup Strategy

### Retention Policy
- **Daily Snapshots**: Retained for 7 days.
- **Weekly Snapshots**: Retained for 4 weeks.
- **Monthly Snapshots**: Retained for 12 months.

### Automated Backup Script (`scripts/backup_mongodb.sh`)

```bash
#!/usr/bin/env bash
set -euo pipefail

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/mongodb"
DB_NAME="portfolio_db"
ARCHIVE_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.archive.gz"

mkdir -p "${BACKUP_DIR}"

echo "[$(date -u)] Starting automated backup for ${DB_NAME}..."

# Perform mongodump using gzip archive
mongodump \
  --uri="${MONGODB_URI}" \
  --archive="${ARCHIVE_FILE}" \
  --gzip

echo "[$(date -u)] Backup completed successfully: ${ARCHIVE_FILE}"

# Enforce 7-day retention for daily backups
find "${BACKUP_DIR}" -type f -name "${DB_NAME}_backup_*.archive.gz" -mtime +7 -delete

echo "[$(date -u)] Retention cleanup completed."
```

### Crontab Schedule (Runs daily at 02:00 AM UTC)
```cron
0 2 * * * /bin/bash /opt/portfolio/scripts/backup_mongodb.sh >> /var/log/mongodb_backup.log 2>&1
```

---

## 3. Disaster Recovery & Restore Procedure

In the event of database corruption, accidental drop, or hardware failure:

### Step 1: Verify Backup Archive Integrity
```bash
# Check archive exists and is non-empty
ls -lh /var/backups/mongodb/portfolio_db_backup_LATEST.archive.gz

# Test gzip integrity without decompressing
gzip -t /var/backups/mongodb/portfolio_db_backup_LATEST.archive.gz
echo "Archive integrity verified."
```

### Step 2: Execute Restore
```bash
# Restore directly using mongorestore with --drop (cleans existing collections before restoring)
mongorestore \
  --uri="${MONGODB_URI}" \
  --archive="/var/backups/mongodb/portfolio_db_backup_LATEST.archive.gz" \
  --gzip \
  --drop
```

### Step 3: Verification Checks
```javascript
// Verify collections and document counts in mongo shell
use portfolio_db;
show collections;
db.contacts.countDocuments();
db.contacts.findOne();
```

---

## 4. Secret Rotation Procedure

1. **When to rotate**:
   - Immediately upon any potential credential exposure or team personnel change.
   - At least once every 90 days as a standard security practice.
2. **Rotation Checklist**:
   - [ ] Google App Password: Revoke existing key in Google Account > Security > App Passwords. Generate new 16-character key and update `EMAIL_PASS`.
   - [ ] `ADMIN_API_KEY`: Generate 32-byte hex key (`node -e "console.log(crypto.randomBytes(32).toString('hex'))"`) and update `Backend/.env`.
   - [ ] `JWT_SECRET`: Generate 64-byte random string and update `JWT_SECRET` in environment variables.
   - [ ] Restart backend process (`npm run prod`).
   - [ ] Confirm no downtime via `/api/v1/health`.
