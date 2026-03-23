import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler so any rejected promise is automatically
 * forwarded to Express's global error handler via next(err).
 *
 * Before:
 *   async (req, res, next) => { try { ... } catch(e) { next(e) } }
 *
 * After:
 *   catchAsync(async (req, res) => { ... })
 */
const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next).catch(next))
};

export default catchAsync;