import { authService } from '../services/authService.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in or register to access this resource.',
      code: 'AUTH_REQUIRED',
    });
  }

  const payload = authService.verifyToken(token);
  if (!payload || !payload.userId) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please sign in again.',
      code: 'AUTH_INVALID',
    });
  }

  req.user = payload;
  next();
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }

  if (token) {
    const payload = authService.verifyToken(token);
    if (payload && payload.userId) {
      req.user = payload;
    }
  }

  next();
}
