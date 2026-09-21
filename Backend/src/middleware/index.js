/**
 * Security & performance middleware wiring:
 * helmet (secure headers), cors (whitelisted origin), compression (gzip),
 * json body parsing, NoSQL-injection body sanitization, rate limiting and
 * request logging.
 */
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES } from '../config/constants.js';
import { fail } from '../common/ApiResponse.js';
import ApiError from '../common/ApiError.js';
export { adminAuth } from './adminAuth.js';

/** Secure HTTP headers. */
export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", config.clientUrl],
    },
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  hidePoweredBy: true,
});

/** CORS: only the frontend origin (and localhost in dev) may call the API. */
export const corsOptions = {
  origin(origin, callback) {
    const configuredOrigins = (config.clientUrl || '')
      .split(',')
      .map(o => o.trim().replace(/\/+$/, ''))
      .filter(Boolean);

    const defaultAllowed = [
      'https://gauravchavdavhits.github.io',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      ...configuredOrigins
    ];

    // Allow same-origin/no-origin (server-to-server, health checks, cron) and allowed origins
    if (!origin || defaultAllowed.includes(origin) || defaultAllowed.includes(origin.replace(/\/+$/, ''))) {
      return callback(null, true);
    }
    return callback(ApiError.forbidden(`Origin '${origin}' not allowed by CORS policy`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 86400,
};

/** Gzip compression for smaller responses (performance). */
export const gzip = compression({ threshold: 1024 });

/** Body parsing limits (protects against oversized payloads). */
export const bodyParser = {
  json: express => express.json({ limit: '16kb' }),
  urlencoded: express => express.urlencoded({ extended: true, limit: '16kb' }),
};

/**
 * NoSQL injection guard for req.body only (Express 5 made req.query getter-only,
 * so mutating query sanitizers break; we don't use Mongo, so body-level cleanup suffices).
 */
export const sanitizeBody = () => (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    const clean = (obj) => {
      for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) delete obj[key];
        else if (obj[key] && typeof obj[key] === 'object') clean(obj[key]);
      }
    };
    clean(req.body);
  }
  next();
};

/** General API rate limiter: protects public endpoints from general abuse. */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY_AUDIT] RATE_LIMIT_EXCEEDED: General API, IP=${req.ip}, Path=${req.originalUrl}`);
    return fail(res, {
      status: HTTP_STATUS.TOO_MANY_REQUESTS,
      code: ERROR_CODES.RATE_LIMITED,
      message: ERROR_MESSAGES.RATE_LIMITED,
    });
  },
});

/**
 * Dedicated strict contact submission rate limiter.
 * Prevents SMTP quota exhaustion, email inbox flooding, and mail server blacklisting.
 */
export const contactSubmitLimiter = rateLimit({
  windowMs: config.rateLimitContactWindowMs,
  max: config.rateLimitContactMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY_AUDIT] RATE_LIMIT_EXCEEDED: Contact Form, IP=${req.ip}, Path=${req.originalUrl}`);
    return fail(res, {
      status: HTTP_STATUS.TOO_MANY_REQUESTS,
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many contact messages submitted from this IP. Please wait 15 minutes or email directly.',
    });
  },
});

/**
 * Dedicated login rate limiter to protect against brute-force & credential stuffing.
 */
export const loginLimiter = rateLimit({
  windowMs: config.rateLimitLoginWindowMs,
  max: config.rateLimitLoginMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY_AUDIT] RATE_LIMIT_EXCEEDED: Admin Login, IP=${req.ip}, Path=${req.originalUrl}`);
    return fail(res, {
      status: HTTP_STATUS.TOO_MANY_REQUESTS,
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many login attempts from this IP. Please wait 15 minutes before trying again.',
    });
  },
});

/**
 * HTTP Cache-Control header middleware for dynamic/authenticated APIs.
 * Prevents proxies, CDNs, and browsers from caching sensitive responses.
 */
export const noCache = (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

/** HTTP request logging (skipped in tests). */
export const requestLogger = morgan(config.isProd ? 'combined' : config.logLevel, {
  skip: () => config.isTest,
});
