import { getSanitizedConfig } from '../config/env.js';
import { getDatabaseStatus } from '../config/database.js';

export function getHealth(req, res) {
  const config = getSanitizedConfig();
  const dbStatus = getDatabaseStatus();

  return res.json({
    status: 'ok',
    version: '3.0.0-level3-release',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    ai: {
      provider: config.ai.provider,
      model: config.ai.model,
      isLive: config.ai.isLive,
      hasKey: config.ai.hasKey,
      keyMasked: config.ai.keyMasked,
    },
    database: {
      status: dbStatus.statusText,
      isConnected: dbStatus.isConnected,
      hasUriConfigured: config.database.hasUri,
      uriMasked: config.database.uriMasked,
      error: dbStatus.error,
    },
    integrations: config.integrations,
    endpoints: [
      { method: 'POST', path: '/api/generate', desc: 'Synthesizes complete website from natural language' },
      { method: 'POST', path: '/api/generate/sketch', desc: 'Vision analysis of wireframe image to layout' },
      { method: 'POST', path: '/api/generate/section', desc: 'Regenerates targeted section without altering others' },
      { method: 'POST', path: '/api/chat-edit', desc: 'Conversational chat editing and theme changes' },
      { method: 'POST', path: '/api/repair/diagnose', desc: 'Deterministic flaw diagnosis of HTML/CSS' },
      { method: 'POST', path: '/api/repair/apply', desc: 'Applies verified patches to HTML/CSS' },
      { method: 'POST', path: '/api/quality/audit', desc: 'WCAG accessibility, SEO, and responsive audit' },
      { method: 'GET', path: '/api/projects', desc: 'Lists projects with search and category filters' },
      { method: 'POST', path: '/api/projects', desc: 'Saves or updates project with version tracking' },
      { method: 'GET', path: '/api/projects/:id', desc: 'Fetches single project' },
      { method: 'DELETE', path: '/api/projects/:id', desc: 'Deletes project' },
      { method: 'POST', path: '/api/projects/:id/duplicate', desc: 'Duplicates project' },
      { method: 'GET', path: '/api/projects/:id/versions', desc: 'Retrieves version snapshots' },
      { method: 'POST', path: '/api/projects/:id/versions/:versionId/restore', desc: 'Restores earlier version' },
      { method: 'GET', path: '/api/projects/:id/prompts', desc: 'Retrieves prompt history' },
      { method: 'GET', path: '/api/github/status', desc: 'Inspects GitHub integration connectivity' },
      { method: 'GET', path: '/api/github/repos', desc: 'Fetches accessible repositories for authenticated user' },
      { method: 'POST', path: '/api/github/scan-security', desc: 'Validates source files against secrets & prohibited paths' },
      { method: 'POST', path: '/api/github/publish', desc: 'Publishes actual source files to GitHub repository' },
      { method: 'GET', path: '/api/github/history', desc: 'Lists recent GitHub publishing audit records' },
      { method: 'GET', path: '/api/deploy/status', desc: 'Checks live deployment provider configuration (Vercel, Netlify)' },
      { method: 'POST', path: '/api/deploy', desc: 'Deploys generated website to production edge host' },
      { method: 'GET', path: '/api/deploy/:id/health', desc: 'Retrieves provider deployment status and ready URL' },
      { method: 'GET', path: '/api/deploy/history', desc: 'Lists production deployment history from MongoDB' },
      { method: 'GET', path: '/api/health', desc: 'Health status and configuration inspection' },
    ],
  });
}
