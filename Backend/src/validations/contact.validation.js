/**
 * Joi validation schemas for the Contact module (single source of truth).
 */
import Joi from 'joi';
import { HTTP_STATUS } from '../config/constants.js';

const name = Joi.string()
  .trim()
  .min(2)
  .max(80)
  .pattern(/^[^\r\n]+$/)
  .required()
  .messages({
    'string.base': 'Name must be a valid text string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 80 characters',
    'string.pattern.base': 'Name cannot contain line breaks or control characters',
    'any.required': 'Name is required',
  });

const email = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .max(120)
  .required()
  .messages({
    'string.base': 'Email must be a valid text string',
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email cannot exceed 120 characters',
    'any.required': 'Email is required',
  });

const phone = Joi.string()
  .trim()
  .pattern(/^[0-9+\s\-()]{7,25}$/)
  .required()
  .messages({
    'string.base': 'Phone number must be a valid text string',
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Please enter a valid phone number (7-25 digits, +, hyphens allowed)',
    'any.required': 'Phone number is required',
  });

const address = Joi.string()
  .trim()
  .max(250)
  .allow('', null)
  .optional()
  .messages({
    'string.base': 'Address must be a valid text string',
    'string.max': 'Address cannot exceed 250 characters',
  });

const subject = Joi.string()
  .trim()
  .max(150)
  .pattern(/^[^\r\n]+$/)
  .allow('', null)
  .optional()
  .messages({
    'string.base': 'Subject must be a valid text string',
    'string.max': 'Subject cannot exceed 150 characters',
    'string.pattern.base': 'Subject cannot contain line breaks or control characters',
  });

const message = Joi.string()
  .trim()
  .min(5)
  .max(2000)
  .required()
  .messages({
    'string.base': 'Message must be a valid text string',
    'string.empty': 'Message is required',
    'string.min': 'Message must be at least 5 characters long',
    'string.max': 'Message cannot exceed 2000 characters',
    'any.required': 'Message is required',
  });

export const contactSchema = {
  create: Joi.object({
    name,
    email,
    phone,
    address,
    subject,
    message,
  }),
  params: Joi.object({
    id: Joi.alternatives()
      .try(Joi.number().integer().positive(), Joi.string().hex().length(24))
      .required()
      .messages({
        'alternatives.match': 'Invalid ID format',
        'any.required': 'ID parameter is required',
      }),
  }),
  list: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }).unknown(false),
};

