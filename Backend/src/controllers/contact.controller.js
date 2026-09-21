/**
 * Contact Controller (MVC - C).
 * Thin HTTP layer: no business logic, no direct model access.
 */
import ContactService from '../services/contact.service.js';
import { ok, created } from '../common/ApiResponse.js';
import asyncHandler from '../common/asyncHandler.js';

export const createContact = asyncHandler(async (req, res) => {
  const data = await ContactService.createMessage(req.body);
  return created(res, { message: 'Message sent successfully! I will get back to you soon.', data });
});

export const listContacts = asyncHandler(async (req, res) => {
  const { data, meta } = await ContactService.listMessages(req.query);
  return ok(res, { message: 'Contact messages fetched', data, meta });
});

export const getContact = asyncHandler(async (req, res) => {
  const data = await ContactService.getMessage(req.params.id);
  return ok(res, { message: 'Contact message fetched', data });
});

export default { createContact, listContacts, getContact };
