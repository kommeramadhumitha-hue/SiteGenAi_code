import { authService } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    return res.status(201).json({
      success: true,
      user: result.user,
      token: result.token,
      message: 'Account successfully created.',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Registration failed',
    });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.json({
      success: true,
      user: result.user,
      token: result.token,
      message: 'Successfully authenticated.',
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err.message || 'Authentication failed',
    });
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
}
