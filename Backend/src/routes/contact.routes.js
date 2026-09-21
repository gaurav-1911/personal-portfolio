/**
 * Contact Routes: POST /api/v1/contact, GET /api/v1/contact
 */
import { Router } from 'express';
import controller from '../controllers/contact.controller.js';
import validate from '../middleware/validate.js';
import { contactSchema } from '../validations/contact.validation.js';
import { contactSubmitLimiter, adminAuth, apiLimiter } from '../middleware/index.js';

const router = Router();

// Public: Send contact message (protected by dedicated strict rate limiter & validation)
router
  .route('/')
  .post(contactSubmitLimiter, validate({ body: contactSchema.create }), controller.createContact);

// Admin Only: View private message inbox (protected by adminAuth, RBAC, and pagination)
router
  .route('/')
  .get(adminAuth, apiLimiter, validate({ query: contactSchema.list }), controller.listContacts);

// Admin Only: View individual private message by ID
router
  .route('/:id')
  .get(adminAuth, apiLimiter, validate({ params: contactSchema.params }), controller.getContact);

export default router;
