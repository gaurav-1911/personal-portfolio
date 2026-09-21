/**
 * Standardized error class thrown by services/controllers.
 * Captured by the global error handler and converted to a clean JSON response.
 */
import { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES } from '../config/constants.js';

export class ApiError extends Error {
  constructor(statusCode, message, code = ERROR_CODES.INTERNAL_ERROR, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = ERROR_MESSAGES.VALIDATION_ERROR, details) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, ERROR_CODES.VALIDATION_ERROR, details);
  }

  static notFound(message = ERROR_MESSAGES.NOT_FOUND) {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message, ERROR_CODES.NOT_FOUND);
  }

  static conflict(message = ERROR_MESSAGES.CONFLICT) {
    return new ApiError(HTTP_STATUS.CONFLICT, message, ERROR_CODES.CONFLICT);
  }

  static unauthorized(message = ERROR_MESSAGES.UNAUTHORIZED, details) {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message, ERROR_CODES.UNAUTHORIZED, details);
  }

  static forbidden(message = ERROR_MESSAGES.FORBIDDEN, details) {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message, ERROR_CODES.FORBIDDEN, details);
  }

  static internal(message = ERROR_MESSAGES.INTERNAL_ERROR) {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, ERROR_CODES.INTERNAL_ERROR);
  }
}

export default ApiError;
