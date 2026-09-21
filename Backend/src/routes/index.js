/**
 * Root API router: mounts every feature module under /api/v1.
 * Adding a new module = one line here.
 */
import { Router } from 'express';
import contactRoutes from './contact.routes.js';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/health', healthRoutes);

export default router;
