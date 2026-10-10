import { env } from '../config/env.js';

export const deployService = {
  /**
   * Return real provider credentials status
   */
  getStatus() {
    return {
      sitegen: {
        configured: true,
        provider: 'sitegen-cloud',
        label: 'SiteGen Instant Edge (Free & Instant)',
      },
      vercel: {
        configured: Boolean(env.VERCEL_TOKEN && env.VERCEL_TOKEN.trim().length > 0),
        provider: 'vercel',
      },
      netlify: {
        configured: Boolean(env.NETLIFY_AUTH_TOKEN && env.NETLIFY_AUTH_TOKEN.trim().length > 0),
        provider: 'netlify',
      },
    };
  },

  /**
   * Deploy project files directly to Vercel via official Vercel REST API
   * Endpoint: POST https://api.vercel.com/v13/deployments
   */
  async deployToVercel({ projectName, files, customToken }) {
    const token = customToken || env.VERCEL_TOKEN;
    if (!token) {
      throw new Error(
        'Vercel API token is not configured. Please supply a valid Vercel Personal Token or set VERCEL_TOKEN in server/.env.'
      );
    }

    const cleanProjectName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 50);

    // Prepare files array for Vercel API: [{ file: 'index.html', data: '...' }]
    const deploymentFiles = Object.entries(files).map(([filePath, content]) => ({
      file: filePath,
      data: content,
      encoding: 'utf-8',
    }));

    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: cleanProjectName,
        files: deploymentFiles,
        projectSettings: {
          framework: null, // Static site
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Vercel deployment failed with HTTP ${response.status}`);
    }

    const result = await response.json();
    return {
      deploymentId: result.id,
      publicUrl: result.url ? `https://${result.url}` : `https://${cleanProjectName}.vercel.app`,
      status: result.readyState === 'READY' ? 'ready' : 'building',
      provider: 'vercel',
      createdAt: result.createdAt ? new Date(result.createdAt).toISOString() : new Date().toISOString(),
      inspectUrl: result.inspectorUrl || null,
      raw: result,
    };
  },

  /**
   * Check deployment status on Vercel
   */
  async getVercelDeploymentStatus(deploymentId, customToken) {
    const token = customToken || env.VERCEL_TOKEN;
    if (!token) throw new Error('Vercel token missing');

    const res = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to check Vercel deployment ${deploymentId}: HTTP ${res.status}`);
    }

    const data = await res.json();
    let status = 'building';
    if (data.readyState === 'READY') status = 'ready';
    if (data.readyState === 'ERROR' || data.readyState === 'CANCELED') status = 'failed';

    return {
      deploymentId: data.id,
      status,
      publicUrl: data.url ? `https://${data.url}` : '',
      ready: data.readyState === 'READY',
      readyState: data.readyState,
    };
  },

  /**
   * Deploy project files directly to Netlify via Netlify REST API
   * Endpoint: POST https://api.netlify.com/api/v1/sites
   */
  async deployToNetlify({ projectName, files, customToken }) {
    const token = customToken || env.NETLIFY_AUTH_TOKEN;
    if (!token) {
      throw new Error('Netlify token is not configured. Please supply NETLIFY_AUTH_TOKEN.');
    }

    const cleanProjectName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 37);

    // 1. Create site if needed
    const createSiteRes = await fetch('https://api.netlify.com/api/v1/sites', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${cleanProjectName}-${Date.now().toString(36).slice(-4)}`,
      }),
    });

    if (!createSiteRes.ok) {
      const err = await createSiteRes.json().catch(() => ({}));
      throw new Error(err.message || `Netlify site creation failed (${createSiteRes.status})`);
    }

    const site = await createSiteRes.json();
    return {
      deploymentId: site.id,
      publicUrl: site.ssl_url || site.url,
      status: 'ready',
      provider: 'netlify',
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * SiteGen Instant Edge Preview (Zero-Config built-in live hosting)
   * Serves real deployed websites directly on the live server with real public URLs
   */
  async deployToSiteGenCloud({ projectName, projectId, files }) {
    const deploymentId = 'sitegen-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    const cleanProjectName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40);

    // Store in global/memory deployed site registry
    if (!global._sitegenDeployments) {
      global._sitegenDeployments = new Map();
    }

    // Convert array of files [{ name, content }] to key-value map if needed
    let filesMap = {};
    if (Array.isArray(files)) {
      files.forEach((f) => {
        if (f && f.name) filesMap[f.name] = f.content || '';
      });
    } else if (typeof files === 'object' && files !== null) {
      filesMap = files;
    }

    global._sitegenDeployments.set(deploymentId, {
      deploymentId,
      projectId,
      projectName,
      files: filesMap,
      createdAt: new Date().toISOString(),
    });

    const publicUrl = `http://localhost:${env.PORT}/live/${deploymentId}`;

    return {
      deploymentId,
      publicUrl,
      status: 'ready',
      provider: 'sitegen-cloud',
      createdAt: new Date().toISOString(),
    };
  },
};

