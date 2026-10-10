import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { User } from '../models/index.js';
import { getDatabaseStatus } from '../config/database.js';

// Secret key for signing tokens
const TOKEN_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'sitegen-auth-secret-key-prod-2026';

// Fallback users file path
const DATA_DIR = path.resolve('server/data');
const USERS_BACKUP_FILE = path.join(DATA_DIR, 'local_users.json');

// Ensure local fallback directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create fallback data dir', err);
  }
}

// In-memory fallback users store
let memoryUsers = [];
try {
  if (fs.existsSync(USERS_BACKUP_FILE)) {
    memoryUsers = JSON.parse(fs.readFileSync(USERS_BACKUP_FILE, 'utf-8'));
  }
} catch {
  memoryUsers = [];
}

function persistUsersFallback() {
  try {
    fs.writeFileSync(USERS_BACKUP_FILE, JSON.stringify(memoryUsers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Auth Storage] Failed to persist fallback users:', err.message);
  }
}

// Password hashing using Scrypt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// Token generation and verification using HMAC-SHA256
function createToken(payload, expiresInHours = 72) {
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const data = { ...payload, exp };
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedData)
    .digest('base64url');
  return `${encodedData}.${signature}`;
}

function verifyToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedData, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(encodedData)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export const authService = {
  async register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Full Name must be at least 2 characters.');
    }
    if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const { isConnected } = getDatabaseStatus();

    // Check if user already exists
    if (isConnected) {
      const existing = await User.findOne({ email: normalizedEmail }).lean();
      if (existing) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
    } else {
      const existing = memoryUsers.find((u) => u.email === normalizedEmail);
      if (existing) {
        throw new Error('An account with this email address already exists. Please sign in instead.');
      }
    }

    const userId = 'usr-' + Date.now().toString(36) + '-' + crypto.randomBytes(4).toString('hex');
    const passwordHash = hashPassword(password);

    const userObj = {
      userId,
      name: cleanName,
      email: normalizedEmail,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    if (isConnected) {
      await User.create({
        ...userObj,
        passwordHash,
      });
    } else {
      memoryUsers.push({
        ...userObj,
        passwordHash,
      });
      persistUsersFallback();
    }

    const token = createToken({ userId, email: normalizedEmail, name: cleanName });

    return {
      user: userObj,
      token,
    };
  },

  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error('Email address and password are required.');
    }

    const { isConnected } = getDatabaseStatus();
    let userRecord = null;

    if (isConnected) {
      userRecord = await User.findOne({ email: normalizedEmail }).lean();
    } else {
      userRecord = memoryUsers.find((u) => u.email === normalizedEmail);
    }

    if (!userRecord || !userRecord.passwordHash) {
      throw new Error('Invalid email or password. Please verify your credentials and try again.');
    }

    const isValid = verifyPassword(password, userRecord.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password. Please verify your credentials and try again.');
    }

    const userObj = {
      userId: userRecord.userId,
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role || 'user',
      createdAt: userRecord.createdAt,
    };

    const token = createToken({ userId: userObj.userId, email: userObj.email, name: userObj.name });

    return {
      user: userObj,
      token,
    };
  },

  async getMe(userId) {
    const { isConnected } = getDatabaseStatus();
    if (isConnected) {
      const doc = await User.findOne({ userId }).select('-passwordHash').lean();
      return doc || null;
    }
    const mem = memoryUsers.find((u) => u.userId === userId);
    if (!mem) return null;
    const { passwordHash, ...safeUser } = mem;
    return safeUser;
  },

  verifyToken,
};
