import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.RATE_LIMIT_MAX || 60, // Limit each IP to 60 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded: Too many AI requests from this origin. Please wait a few minutes before trying again.',
    retryAfterMinutes: 15,
  },
});
