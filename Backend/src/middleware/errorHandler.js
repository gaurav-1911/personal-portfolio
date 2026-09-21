/**
 * Global error-handling middleware (must be registered LAST in app.js).
 * - Converts Joi validation errors -> 400 with field details
 * - Converts unknown/unexpected errors -> 500 (hides internals in production)
 */
import { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES } from '../config/constants.js';
import { fail } from '../common/ApiResponse.js';
import { config } from '../config/env.js';

/** Normalize anything thrown into a uniform error payload. */
const buildErrorPayload = (err) => {
  // Joi validation errors
  if (err.isJoi) {
    const errors = err.details.map((d) => ({
      field: d.path.join('.') || '_',
      message: d.message,
    }));
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: errors[0]?.message || ERROR_MESSAGES.VALIDATION_ERROR,
      errors,
    };
  }

  // Body-parser JSON syntax errors
  if (err.type === 'entity.parse.failed') {
    return {
      status: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Malformed JSON payload',
    };
  }

  // Our operational errors
  if (err.statusCode) {
    return {
      status: err.statusCode,
      code: err.code || ERROR_CODES.INTERNAL_ERROR,
      message: err.message,
      ...(err.details && { errors: err.details }),
    };
  }

  // Fallback: unexpected error
  return {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: config.isProd ? ERROR_MESSAGES.INTERNAL_ERROR : err.message || ERROR_MESSAGES.INTERNAL_ERROR,
  };
};

export const notFoundHandler = (req, res) =>
  fail(res, {
    status: HTTP_STATUS.NOT_FOUND,
    code: ERROR_CODES.NOT_FOUND,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });

// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err, req, res, _next) => {
  const payload = buildErrorPayload(err);

  if (!config.isTest) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${payload.status}`, err.statusCode ? err.message : err);
  }

  // If headers already sent, delegate to Express default handler
  if (res.headersSent) return res.end();

  return fail(res, payload);
};

export default globalErrorHandler;
