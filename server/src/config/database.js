import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;
let connectionError = null;

export async function connectDatabase() {
  const uri = env.MONGODB_URI?.trim();

  if (!uri) {
    console.log('[Database] MONGODB_URI not set. Running in Fallback/Local Storage Mode.');
    isConnected = false;
    connectionError = 'MONGODB_URI is not configured in server/.env';
    return false;
  }

  try {
    console.log('[Database] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isConnected = true;
    connectionError = null;
    console.log('[Database] Successfully connected to MongoDB Atlas! ✓');
    return true;
  } catch (err) {
    isConnected = false;
    connectionError = err.message || 'Failed to connect to MongoDB cluster';
    console.warn(`[Database Warning] MongoDB connection failed: ${connectionError}. Operating in Fallback Mode.`);
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[Database] MongoDB connection closed.');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  connectionError = err.message;
  console.error('[Database Error]', err);
});

export function getDatabaseStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    statusText: isConnected ? 'connected' : 'disconnected (fallback mode)',
    error: connectionError,
    modelsLoaded: Object.keys(mongoose.models),
  };
}
