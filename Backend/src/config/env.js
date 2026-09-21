/**
 * Central environment loader & accessor.
 * All config reads go through here (single source of truth).
 *
 * Security: No hard-coded fallback secrets. In production, critical secrets
 * (ADMIN_API_KEY, ADMIN_PASSWORD, JWT_SECRET, EMAIL_PASS) are MANDATORY and
 * validated at boot. In development, missing JWT_SECRET creates an ephemeral
 * cryptographically-random secret so the server still bootstraps safely.
 */
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const env = (key, fallback = undefined) => process.env[key] ?? fallback;

/**
 * Generates a throwaway cryptographically-random secret.
 * Only used for local development when JWT_SECRET is not configured.
 */
const generateDevSecret = () =>
  crypto.randomBytes(64).toString('hex');

const nodeEnv = env('NODE_ENV', 'development');
const isProd = nodeEnv === 'production';

const jwtSecret = env('JWT_SECRET', '');
const adminApiKey = env('ADMIN_API_KEY', '');
const adminPassword = env('ADMIN_PASSWORD', '');
const mailPass = env('EMAIL_PASS', '');

export const config = {
  nodeEnv,
  isProd,
  isTest: nodeEnv === 'test',
  port: Number(env('PORT', 5000)),
  clientUrl: env('CLIENT_URL', 'http://localhost:5173'),
  // Production Database URI (MongoDB Atlas / local MongoDB)
  mongodbUri: env('MONGODB_URI', 'mongodb://127.0.0.1:27017/portfolio_db'),
  // Reverse Proxy Configuration (e.g. 1 for single proxy layer like Nginx/Cloudflare)
  trustProxy: env('TRUST_PROXY', '1'),
  // Rate limiting (general API)
  rateLimitWindowMs: Number(env('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
  rateLimitMax: Number(env('RATE_LIMIT_MAX', 100)),
  // Rate limiting (contact submission - stricter protection against mail spam/flooding)
  rateLimitContactWindowMs: Number(env('RATE_LIMIT_CONTACT_WINDOW_MS', 15 * 60 * 1000)),
  rateLimitContactMax: Number(env('RATE_LIMIT_CONTACT_MAX', 5)),
  // Rate limiting (admin login brute-force protection)
  rateLimitLoginWindowMs: Number(env('RATE_LIMIT_LOGIN_WINDOW_MS', 15 * 60 * 1000)),
  rateLimitLoginMax: Number(env('RATE_LIMIT_LOGIN_MAX', 5)),
  // Admin Authorization & Credentials
  adminApiKey,
  adminEmail: env('ADMIN_EMAIL', 'admin@gaurav.dev'),
  adminPassword,
  // No insecure hard-coded fallback: dev gets an ephemeral random secret,
  // production fails fast during validation below if this is empty.
  jwtSecret: jwtSecret || generateDevSecret(),
  // Logging
  logLevel: env('LOG_LEVEL', 'dev'),
  // Mail configuration (Nodemailer)
  mail: {
    host: env('SMTP_HOST', 'smtp.gmail.com'),
    port: Number(env('SMTP_PORT', 465)),
    secure: env('SMTP_SECURE', 'true') === 'true',
    user: env('EMAIL_USER', 'gauravbhai1911@gmail.com'),
    pass: mailPass,
    from: env('EMAIL_FROM', '"Gaurav Chavda Portfolio" <gauravbhai1911@gmail.com>'),
    to: env('CONTACT_RECEIVER_EMAIL', 'gauravbhai1911@gmail.com'),
  },
};

/**
 * Boot-time configuration validation.
 * Fails fast (exits with error) if production secrets are missing or weak,
 * instead of silently running with insecure defaults.
 */
export const validateConfig = () => {
  if (!isProd) return;

  const missing = [];
  if (!adminApiKey) missing.push('ADMIN_API_KEY');
  if (!adminPassword) missing.push('ADMIN_PASSWORD');
  if (!jwtSecret) missing.push('JWT_SECRET');
  if (!mailPass) missing.push('EMAIL_PASS');
  if (!config.mongodbUri) missing.push('MONGODB_URI');

  if (missing.length > 0) {
    console.error(
      `[BOOT] ❌ Production configuration error: missing required environment variable(s): ${missing.join(', ')}`
    );
    console.error('[BOOT] Refusing to start in production mode with insecure missing secrets.');
    process.exit(1);
  }
};

export default config;