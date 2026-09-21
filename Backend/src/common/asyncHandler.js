/**
 * Wraps async controllers so rejected promises reach the global error handler.
 * Usage: router.get('/', asyncHandler(controller.fn))
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
