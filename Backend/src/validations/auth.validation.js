/**
 * Joi validation schema for Authentication endpoints.
 */
import Joi from 'joi';

export const authSchema = {
  login: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .max(120)
      .required()
      .messages({
        'string.base': 'Email must be a valid text string',
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.base': 'Password must be a valid text string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required',
      }),
  }).unknown(false),

  forgotPassword: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .max(120)
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
  }).unknown(false),

  resetPassword: Joi.object({
    token: Joi.string()
      .hex()
      .length(64)
      .required()
      .messages({
        'string.empty': 'Reset token is required',
        'string.hex': 'Reset token must be a valid 64-character hex string',
        'string.length': 'Reset token must be 64 characters long',
        'any.required': 'Reset token is required',
      }),
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .required()
      .messages({
        'string.empty': 'New password is required',
        'string.min': 'New password must be at least 8 characters long',
        'string.max': 'New password cannot exceed 128 characters',
        'any.required': 'New password is required',
      }),
  }).unknown(false),
};

export default authSchema;
