/**
 * Auth Controller.
 * Thin HTTP layer for authentication routes.
 */
import AuthService from '../services/auth.service.js';
import { ok } from '../common/ApiResponse.js';
import asyncHandler from '../common/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body);
  return ok(res, {
    message: 'Admin authentication successful',
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  return ok(res, {
    message: 'Current authenticated session profile fetched',
    data: { user: req.user },
  });
});

export const logout = asyncHandler(async (_req, res) => {
  return ok(res, {
    message: 'Session terminated cleanly. Discard token on client.',
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body.email);
  return ok(res, {
    message: result.message,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.resetPassword(req.body);
  return ok(res, {
    message: result.message,
  });
});

export default { login, getMe, logout, forgotPassword, resetPassword };

