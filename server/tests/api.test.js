import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();
let authToken = '';

describe('Backend API Endpoints Integration Tests', () => {
  beforeAll(async () => {
    // Register and authenticate a dedicated test user
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration Test User',
        email: `test-${Date.now()}@sitegen.ai`,
        password: 'Password123!',
      });
    authToken = regRes.body.token;
  });

  it('GET /api/health returns 200 OK with endpoint catalog and service status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toContain('3.0.0');
    expect(Array.isArray(res.body.endpoints)).toBe(true);
    expect(res.body.endpoints.length).toBeGreaterThan(5);
  });

  it('POST /api/generate rejects unauthenticated visitors with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/generate')
      .send({
        prompt: 'Unauthenticated prompt',
        category: 'saas',
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('AUTH_REQUIRED');
  });

  it('POST /api/generate with valid prompt generates a complete website when authenticated', async () => {
    const res = await request(app)
      .post('/api/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        prompt: 'Modern SaaS analytics platform with dark violet cards',
        category: 'saas',
        language: 'en',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.project).toBeDefined();
    expect(res.body.project.name).toBeDefined();
    expect(Array.isArray(res.body.project.sections)).toBe(true);
    expect(res.body.project.sections.length).toBeGreaterThanOrEqual(4);
    expect(Array.isArray(res.body.agentLogs)).toBe(true);
    expect(res.body.agentLogs.length).toBe(6); // 6 agents
  }, 120000);

  it('POST /api/generate with invalid prompt fails with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        prompt: 'a', // Too short
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('POST /api/chat-edit modifies theme or section', async () => {
    const initialRes = await request(app)
      .post('/api/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        prompt: 'Minimalist designer portfolio',
        category: 'portfolio',
      });

    const project = initialRes.body.project;

    const editRes = await request(app)
      .post('/api/chat-edit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        instruction: 'Switch theme to emerald green palette',
        project,
      });

    expect(editRes.status).toBe(200);
    expect(editRes.body.success).toBe(true);
    expect(editRes.body.project.palette.primary).toBe('#10b981');
    expect(editRes.body.changeSummary).toContain('Emerald Aurora');
  }, 30000);

  it('POST /api/repair/diagnose detects HTML/CSS defects', async () => {
    const brokenHtml = `<html><head></head><body>
      <div style="width: 1200px;">
        <img src="pic.jpg">
        <input type="text">
        <a href="#" target="_blank">Click</a>
      </div>
    </body></html>`;

    const res = await request(app)
      .post('/api/repair/diagnose')
      .send({ html: brokenHtml, css: '' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.issues)).toBe(true);
    expect(res.body.issues.some((i) => i.id === 'fix-viewport')).toBe(true);
    expect(res.body.issues.some((i) => i.id.startsWith('fix-img-alt'))).toBe(true);
    expect(res.body.issues.some((i) => i.id.startsWith('fix-unlabelled-input'))).toBe(true);
  });

  it('POST /api/quality/audit computes objective score and checks', async () => {
    const html = `<!DOCTYPE html><html lang="en"><head><title>Test Site</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><h1>Hello</h1></body></html>`;
    const res = await request(app)
      .post('/api/quality/audit')
      .send({ html });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.report.overallScore).toBeGreaterThanOrEqual(80);
    expect(Array.isArray(res.body.report.checks)).toBe(true);
  });

  it('GET /api/projects rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('AUTH_REQUIRED');
  });

  it('GET /api/projects returns project list when authenticated', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.projects)).toBe(true);
  });

  it('GET /api/github/status returns connectivity configuration', async () => {
    const res = await request(app).get('/api/github/status');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.authMethod).toBeDefined();
  });

  it('POST /api/github/scan-security flags sensitive tokens and secret patterns', async () => {
    const cleanFiles = {
      'index.html': '<html><body><h1>Hello World</h1></body></html>',
      'styles.css': 'body { background: #000; }',
    };
    const cleanRes = await request(app)
      .post('/api/github/scan-security')
      .send({ files: cleanFiles });
    expect(cleanRes.status).toBe(200);
    expect(cleanRes.body.isClean).toBe(true);
    expect(cleanRes.body.warnings.length).toBe(0);

    const sensitiveFiles = {
      'config.js': 'const key = "ghp_123456789012345678901234567890123456";',
      '.env': 'OPENAI_API_KEY=sk-testsecretkey12345678901234567890',
    };
    const sensitiveRes = await request(app)
      .post('/api/github/scan-security')
      .send({ files: sensitiveFiles });
    expect(sensitiveRes.status).toBe(200);
    expect(sensitiveRes.body.isClean).toBe(false);
    expect(sensitiveRes.body.warnings.length).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/github/publish cleanly blocks publishing when unconfigured and no token supplied', async () => {
    const res = await request(app)
      .post('/api/github/publish')
      .set('x-github-token', '')
      .send({
        repoName: 'test-unauthorized-repo',
        files: { 'index.html': '<h1>Test</h1>' },
      });
    // Should fail cleanly with 400 or 401 without faking success
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  }, 15000);

  it('GET /api/deploy/status returns hosting provider configuration status', async () => {
    const res = await request(app).get('/api/deploy/status');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.providers.vercel).toBeDefined();
  });

  it('POST /api/deploy rejects unconfigured deployment without fabricating URLs', async () => {
    const res = await request(app)
      .post('/api/deploy')
      .send({
        projectId: 'test-proj',
        projectName: 'Test Project',
        provider: 'vercel',
        files: { 'index.html': '<h1>Hello</h1>' },
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.isBlocked).toBe(true);
    expect(res.body.setupGuide).toBeDefined();
  });

  it('GET /api/deploy/history returns array of deployment records', async () => {
    const res = await request(app).get('/api/deploy/history');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.deployments)).toBe(true);
  });
});
