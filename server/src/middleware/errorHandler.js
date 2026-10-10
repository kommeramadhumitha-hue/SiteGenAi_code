import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  // If response already sent, delegate to default express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle Zod schema errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  // Handle syntax/parsing error
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Malformed JSON payload',
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  // Do not expose stack trace or private secrets to clients
  console.error(`[API Error ${statusCode}] ${req.method} ${req.originalUrl}:`, message);

  return res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
  });
}
