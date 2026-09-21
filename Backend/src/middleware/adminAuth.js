/**
 * Admin Authorization Middleware.
 * Protects administrative and sensitive endpoints (e.g. contact inbox messages)
 * against unauthorized access, data scraping, and IDOR attacks.
 *
 * Supports:
 * - Bearer token: `Authorization: Bearer <ADMIN_API_KEY>`
 * - Custom header: `x-admin-key: <ADMIN_API_KEY>`
 *
 * Employs timing-safe string comparison to mitigate timing attacks.
 */
import crypto from 'crypto';
import { config } from '../config/env.js';
import ApiError from '../common/ApiError.js';
import AuthService from '../services/auth.service.js';

export const adminAuth = (req, _res, next) => {
  // Extract token from Authorization header (Bearer) or x-admin-key
  let providedToken = req.headers['x-admin-key'];
  const authHeader = req.headers.authorization;

  if (!providedToken && authHeader && authHeader.startsWith('Bearer ')) {
    providedToken = authHeader.substring(7).trim();
  }

  if (!providedToken) {
    console.warn(`[SECURITY_AUDIT] UNAUTHORIZED_ADMIN_ACCESS: Missing credentials, IP=${req.ip}, Path=${req.originalUrl}`);
    return next(
      ApiError.unauthorized('Authentication required to access this resource. Missing credentials.'),
    );
  }

  // 1. Try verifying as signed session token (JWT)
  const tokenPayload = AuthService.verifyToken(providedToken);
  if (tokenPayload && tokenPayload.role === 'admin') {
    req.user = {
      userId: tokenPayload.userId,
      email: tokenPayload.email,
      role: 'admin',
      isAuthenticated: true,
    };
    return next();
  }

  // 2. Fall back to verifying as static ADMIN_API_KEY
  const configuredKey = config.adminApiKey;
  if (configuredKey) {
    const expectedBuffer = Buffer.from(configuredKey);
    const providedBuffer = Buffer.from(providedToken);

    if (
      expectedBuffer.length === providedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      req.user = {
        userId: 'admin_api_key',
        email: config.adminEmail || 'admin@gaurav.dev',
        role: 'admin',
        isAuthenticated: true,
      };
      return next();
    }
  }

  console.warn(`[SECURITY_AUDIT] UNAUTHORIZED_ADMIN_ACCESS: Invalid/expired credentials, IP=${req.ip}, Path=${req.originalUrl}`);
  return next(ApiError.unauthorized('Invalid or expired admin credentials. Access denied.'));
};

export default adminAuth;
