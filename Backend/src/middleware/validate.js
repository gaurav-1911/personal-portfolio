/**
 * Reusable Joi validation middleware factory.
 * Validates req.body / req.params / req.query against a schema and
 * forwards a normalized 400 error to the global error handler.
 */
import ApiError from '../common/ApiError.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';

/**
 * @param {object} schemas - { body?: Joi.Schema, params?: Joi.Schema, query?: Joi.Schema }
 */
const validate = (schemas) => (req, _res, next) => {
  const sources = ['params', 'query', 'body'];
  for (const source of sources) {
    const schema = schemas[source];
    if (!schema) continue;

    const { error, value } = schema.validate(req[source], {
      abortEarly: false,      // collect ALL field errors, not just the first
      allowUnknown: false,    // reject unexpected keys
      stripUnknown: true,     // remove unknown keys before controllers run
      convert: true,          // coerce types when safe (e.g. "1" -> 1)
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.') || '_',
        message: d.message,
      }));
      return next(
        new ApiError(
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          details[0].message,
          ERROR_CODES.VALIDATION_ERROR,
          details,
        ),
      );
    }

    // Replace with the cleaned/validated value
    // NOTE: Express 5 made req.query a getter-only property, so only body/params are reassigned.
    if (source !== 'query') req[source] = value;
    else Object.defineProperty(req, 'query', { value, writable: true, configurable: true });
  }
  return next();
};

export default validate;
