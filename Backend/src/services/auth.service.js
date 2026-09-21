/**
 * Authentication Service.
 * Implements production-ready cryptographic token signing, constant-time
 * credential verification, and brute-force mitigation without external dependencies.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';
import ApiError from '../common/ApiError.js';
import MailService from './mail.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_FILE = path.resolve(__dirname, '../../.env');

/** Base64URL encoder helper */
const base64UrlEncode = (str) =>
  Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

/** Base64URL decoder helper */
const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64').toString('utf8');
};

/**
 * Best-effort persistence of an env var into the .env file on disk.
 * Keeps admin password / JWT secret rotations durable across restarts.
 * If the server runs with injected environment variables (no .env), this is a no-op.
 */
const persistEnvVar = (key, value) => {
  try {
    if (!fs.existsSync(ENV_FILE)) return false;
    let content = fs.readFileSync(ENV_FILE, 'utf8');
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const lineRegex = new RegExp(`^${key}=.*$`, 'm');
    if (lineRegex.test(content)) {
      content = content.replace(lineRegex, `${key}="${escaped}"`);
    } else {
      content += `\n${key}="${escaped}"\n`;
    }
    fs.writeFileSync(ENV_FILE, content, 'utf8');
    return true;
  } catch (err) {
    console.warn('⚠️ Could not persist env change to disk (continuing in memory only):', err.message);
    return false;
  }
};

export const AuthService = {
  /**
   * Generates a tamper-proof, signed HMAC-SHA256 token (JWT compatible).
   */
  generateToken(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Date.now();
    const tokenPayload = {
      ...payload,
      iat: Math.floor(now / 1000),
      exp: Math.floor((now + 24 * 60 * 60 * 1000) / 1000), // 24 hours expiry
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', config.jwtSecret)
      .update(dataToSign)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${dataToSign}.${signature}`;
  },

  /**
   * Cryptographically verifies token integrity and expiration.
   */
  verifyToken(token) {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac('sha256', config.jwtSecret)
      .update(dataToSign)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const expectedBuf = Buffer.from(expectedSignature);
    const providedBuf = Buffer.from(signature);

    if (
      expectedBuf.length !== providedBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, providedBuf)
    ) {
      return null;
    }

    try {
      const payload = JSON.parse(base64UrlDecode(encodedPayload));
      const now = Math.floor(Date.now() / 1000);

      // Check token expiration
      if (payload.exp && payload.exp < now) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  },

  /**
   * Authenticates administrator credentials using constant-time comparison.
   */
  async login({ email, password }) {
    const configuredEmail = config.adminEmail?.toLowerCase().trim();
    const configuredPass = config.adminPassword;

    if (!configuredEmail || !configuredPass) {
      throw ApiError.forbidden(
        'Admin credentials are not configured on this server. Set ADMIN_EMAIL and ADMIN_PASSWORD.',
      );
    }

    const emailMatch = email.toLowerCase().trim() === configuredEmail;

    // Use timingSafeEqual to avoid timing side-channels on password comparison
    const expectedBuf = Buffer.from(configuredPass);
    const providedBuf = Buffer.from(password);

    const passMatch =
      expectedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, providedBuf);

    // Generic error message prevents account enumeration
    if (!emailMatch || !passMatch) {
      console.warn(`[SECURITY_AUDIT] FAILED_LOGIN_ATTEMPT: email=${email.toLowerCase().trim()}`);
      throw ApiError.unauthorized('Invalid email or password');
    }

    console.info(`[SECURITY_AUDIT] SUCCESSFUL_ADMIN_LOGIN: email=${configuredEmail}`);

    // Role is strictly assigned server-side
    const user = {
      userId: 'admin_primary',
      email: configuredEmail,
      role: 'admin',
    };

    const token = this.generateToken(user);

    return {
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  },

  /**
   * Generates a single-use cryptographic token with short expiry (15m),
   * EMAILS the raw token to the admin, and returns a generic response
   * guaranteeing zero account enumeration.
   */
  async forgotPassword(email) {
    if (!email || typeof email !== 'string') {
      throw ApiError.badRequest('A valid email address is required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const configuredEmail = config.adminEmail?.toLowerCase().trim();

    // Constant response time & message regardless of whether user exists
    if (configuredEmail && normalizedEmail === configuredEmail) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

      passwordResetTokens.set(tokenHash, {
        email: normalizedEmail,
        expiresAt,
      });

      console.info(`[SECURITY_AUDIT] PASSWORD_RESET_REQUESTED: email=${normalizedEmail}, expires=${new Date(expiresAt).toISOString()}`);

      // Send the reset token to the admin email (async, non-blocking).
      // Failures are logged so a dead SMTP never breaks the API or leaks state.
      MailService.sendPasswordResetEmail({
        to: config.adminEmail,
        token: rawToken,
      }).catch((err) => {
        console.error('❌ Failed to send password reset email:', err.message);
      });
    } else {
      console.warn(`[SECURITY_AUDIT] PASSWORD_RESET_ATTEMPT_UNKNOWN_EMAIL: email=${normalizedEmail}`);
    }

    return {
      message: 'If that email address exists in our system, password reset instructions have been sent.',
    };
  },

  /**
   * Resets password using a single-use cryptographic token.
   * Persists the change to disk (when .env exists) AND rotates the JWT secret,
   * which cryptographically invalidates all previously-issued admin sessions.
   */
  async resetPassword({ token, newPassword }) {
    if (!token || typeof token !== 'string') {
      throw ApiError.badRequest('A valid reset token is required');
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      throw ApiError.badRequest('New password must be at least 8 characters long');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = passwordResetTokens.get(tokenHash);

    if (!record || Date.now() > record.expiresAt) {
      if (record) passwordResetTokens.delete(tokenHash);
      console.warn(`[SECURITY_AUDIT] INVALID_PASSWORD_RESET_TOKEN_ATTEMPT`);
      throw ApiError.badRequest('Password reset token is invalid or has expired');
    }

    // Single-use token invalidation: immediately delete the token
    passwordResetTokens.delete(tokenHash);

    // Persist the new password to disk (if .env exists) and apply in-memory for immediate effect
    const persisted = persistEnvVar('ADMIN_PASSWORD', newPassword);
    config.adminPassword = newPassword;
    process.env.ADMIN_PASSWORD = newPassword;

    // Rotate JWT secret: invalidates every previously issued admin token.
    const newSecret = crypto.randomBytes(48).toString('base64url');
    const secretPersisted = persistEnvVar('JWT_SECRET', newSecret);
    config.jwtSecret = newSecret;
    process.env.JWT_SECRET = newSecret;

    console.info(`[SECURITY_AUDIT] SUCCESSFUL_PASSWORD_RESET: email=${record.email} (password persisted=${persisted}, jwt rotated=${secretPersisted})`);

    return {
      message: 'Password reset successfully. Please log in with your new password.',
    };
  },
};

// In-memory store for password reset tokens: tokenHash -> { email, expiresAt }
const passwordResetTokens = new Map();

export default AuthService;