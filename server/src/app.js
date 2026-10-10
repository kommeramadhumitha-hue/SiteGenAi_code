import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiRouter } from './routes/apiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Secure HTTP Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allow sandboxed iframe communication
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl) or allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in development
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // JSON Body Parser with safe 10MB limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Mount API router
  app.use('/api', apiRouter);

  // Serve Live Deployed Websites (SiteGen Instant Edge Hosting)
  app.get('/live/:deploymentId*', (req, res) => {
    const { deploymentId } = req.params;
    const site = global._sitegenDeployments?.get(deploymentId);

    if (!site || !site.files) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Site Not Found - SiteGen AI</title></head>
          <body style="font-family:sans-serif;text-align:center;padding:50px;background:#f8fafc;color:#172033;">
            <h2>Deployment Not Found or Expired</h2>
            <p>Please redeploy this website from the SiteGen AI Deployment Studio.</p>
            <a href="http://localhost:5173/deploy" style="color:#4f46e5;font-weight:bold;">Return to Deployments</a>
          </body>
        </html>
      `);
    }

    const subPath = req.params[0] ? req.params[0].replace(/^\//, '') : '';
    const targetFile = subPath || 'index.html';

    if (site.files[targetFile]) {
      if (targetFile.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
      else if (targetFile.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
      else if (targetFile.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
      else if (targetFile.endsWith('.json')) res.setHeader('Content-Type', 'application/json');

      return res.send(site.files[targetFile]);
    }

    // Default to index.html
    res.setHeader('Content-Type', 'text/html');
    return res.send(site.files['index.html'] || '<h1>Website Deployed Successfully</h1>');
  });

  // 404 for unknown endpoints
  app.use((req, res) => {
    res.status(404).json({
      error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
      supportedDocs: '/api/health',
    });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
