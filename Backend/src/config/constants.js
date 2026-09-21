/**
 * Application-wide constants (single source of truth).
 */
export const APP_NAME = 'Portfolio API';
export const API_PREFIX = '/api/v1';

/** HTTP status codes (avoids magic numbers across the codebase). */
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

/** Application error codes (stable identifiers clients can branch on). */
export const ERROR_CODES = Object.freeze({
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

/** Human-readable default messages, keyed by error code. */
export const ERROR_MESSAGES = Object.freeze({
  VALIDATION_ERROR: 'Invalid input data',
  UNAUTHORIZED: 'Authentication required to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exists',
  RATE_LIMITED: 'Too many requests, please try again later',
  INTERNAL_ERROR: 'Something went wrong on our side',
});
