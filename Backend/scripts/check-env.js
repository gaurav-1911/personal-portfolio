/**
 * Temporary diagnostic: prints masked .env credential info (no raw secrets).
 * Usage: node scripts/check-env.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

const raw = fs.readFileSync(envPath, 'utf8');
const lines = raw.split(/\r?\n/);
const vars = {};
for (const line of lines) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) vars[m[1]] = m[2];
}

const mask = (v) => (v ? `${v[0]}***${v.slice(-1)} (len=${v.length})` : '(empty)');
const clean = (v) => (v || '').trim().replace(/^["']|["']$/g, '');

// --- MONGODB_URI diagnostics ---
const uri = clean(vars.MONGODB_URI);
console.log('=== MONGODB_URI diagnostics ===');
if (!uri) {
  console.log('MONGODB_URI: MISSING');
} else {
  try {
    const u = new URL(uri);
    console.log('scheme     :', u.protocol);
    console.log('user       :', JSON.stringify(u.username));
    console.log('pass       :', mask(clean(decodeURIComponent(u.password || ''))));
    console.log('host       :', u.hostname);
    console.log('dbPath     :', u.pathname || '(EMPTY — no db name!)');
    console.log('params     :', u.search || '(none)');
    const passRaw = u.password || '';
    console.log('pass spaces:', /%20|\s|\+/.test(passRaw) ? 'YES (must be URL-encoded or removed!)' : 'no');
  } catch (e) {
    console.log('❌ URI is malformed and cannot be parsed:', e.message);
  }
}

// --- SMTP diagnostics ---
console.log('\n=== SMTP (Gmail) diagnostics ===');
const user = clean(vars.EMAIL_USER);
const pass = clean(vars.EMAIL_PASS);
console.log('EMAIL_USER :', user ? mask(user) : '(empty)');
console.log('EMAIL_PASS :', pass ? `set (len=${pass.length}, inner-spaces=${(pass.match(/\s/g) || []).length}, quotes=${/^["']|["']$/.test(vars.EMAIL_PASS || '') ? 'yes' : 'no'})` : '(empty)');
console.log('SMTP_HOST  :', clean(vars.SMTP_HOST) || '(default smtp.gmail.com)');
console.log('SMTP_PORT  :', clean(vars.SMTP_PORT) || '(default 465)');

// --- Duplicate key check ---
console.log('\n=== Duplicate keys in .env ===');
const seen = new Map();
let dups = 0;
for (const line of lines) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=/);
  if (m) {
    seen.set(m[1], (seen.get(m[1]) || 0) + 1);
  }
}
for (const [k, n] of seen) {
  if (n > 1) { console.log(`❌ "${k}" appears ${n} times — last one wins`); dups++; }
}
if (dups === 0) console.log('none');
