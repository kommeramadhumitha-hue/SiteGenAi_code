import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

const app = createApp();

async function startServer() {
  console.log('[SiteGen AI] Initializing Level 2 production server...');

  // Connect to MongoDB Atlas (or enable in-memory fallback)
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`[SiteGen AI Backend] Server running on http://localhost:${env.PORT}`);
    console.log(`[SiteGen AI Backend] Health check: http://localhost:${env.PORT}/api/health`);
    console.log(`[SiteGen AI Backend] Frontend URL: ${env.FRONTEND_URL}`);
  });

  // Graceful shutdown handling
  const shutdown = (signal) => {
    console.log(`[Server] Received ${signal}. Gracefully terminating...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('[Server Fatal Error]', err);
  process.exit(1);
});
