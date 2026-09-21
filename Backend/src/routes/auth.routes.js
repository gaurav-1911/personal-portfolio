/**
 * Auth Routes: POST /api/v1/auth/login, GET /api/v1/auth/me, POST /api/v1/auth/logout
 */
import { Router } from 'express';
import controller from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import { authSchema } from '../validations/auth.validation.js';
import { loginLimiter, adminAuth } from '../middleware/index.js';

const router = Router();

// Public: Admin login (protected by brute-force limiter & validation)
router.post('/login', loginLimiter, validate({ body: authSchema.login }), controller.login);

// Public: Forgot password initiation (rate-limited, prevents enumeration)
router.post('/forgot-password', loginLimiter, validate({ body: authSchema.forgotPassword }), controller.forgotPassword);

// Public: Reset password execution (single-use token verification)
router.post('/reset-password', loginLimiter, validate({ body: authSchema.resetPassword }), controller.resetPassword);

// Protected: Get current authenticated admin session
router.get('/me', adminAuth, controller.getMe);

// Public/Client: Terminate session
router.post('/logout', controller.logout);

export default router;
