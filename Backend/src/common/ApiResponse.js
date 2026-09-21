/**
 * Uniform response shape for every endpoint:
 *   success -> { success: true,  message, data?, meta? }
 *   error   -> { success: false, message, code?, errors? }
 */
import { HTTP_STATUS, ERROR_CODES, ERROR_MESSAGES } from '../config/constants.js';

export const ok = (res, { message = 'Success', data = undefined, meta = undefined, status = HTTP_STATUS.OK } = {}) =>
  res.status(status).json({ success: true, message, ...(data !== undefined && { data }), ...(meta && { meta }) });

export const created = (res, { message = 'Resource created', data } = {}) =>
  ok(res, { message, data, status: HTTP_STATUS.CREATED });

export const fail = (
  res,
  { status = HTTP_STATUS.BAD_REQUEST, message = 'Request failed', code = ERROR_CODES.VALIDATION_ERROR, errors = undefined } = {},
) => res.status(status).json({ success: false, message, code, ...(errors && { errors }) });

export default { ok, created, fail };
