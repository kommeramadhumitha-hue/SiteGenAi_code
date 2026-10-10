import { WebsiteProject, WebsiteCategory } from '../types';

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BACKEND_URL) ||
  'http://localhost:5000/api';

const TOKEN_KEY = 'sitegen_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function removeAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface HealthCheckResponse {
  status: string;
  version: string;
  uptimeSeconds: number;
  timestamp: string;
  ai: {
    provider: string;
    model: string;
    isLive: boolean;
    hasKey: boolean;
    keyMasked: string;
  };
  database: {
    status: string;
    isConnected: boolean;
    hasUriConfigured: boolean;
    uriMasked: string;
    error: string | null;
  };
  endpoints: Array<{ method: string; path: string; desc: string }>;
}

export interface BackendGenerateResponse {
  success: boolean;
  project: WebsiteProject;
  agentLogs: Array<{
    agent: string;
    durationMs: number;
    status: string;
    summary: string;
  }>;
  explanation: {
    summary: string;
    keyHighlights: string[];
    repairsNote?: string;
    nextSteps: string[];
  };
  executionTimeMs: number;
  provider: {
    name: string;
    model: string;
    isLive: boolean;
  };
}

export async function checkBackendHealth(): Promise<HealthCheckResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
}

export async function loginUser(payload: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }
  return data;
}

export async function fetchCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function generateViaBackend(params: {
  prompt: string;
  category: WebsiteCategory;
  style?: string;
  language?: 'en' | 'te';
  apiKey?: string;
  aiProvider?: string;
}): Promise<BackendGenerateResponse> {
  const res = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Generation failed with status ${res.status}`);
  }

  return await res.json();
}

export async function chatEditViaBackend(params: {
  instruction: string;
  project: WebsiteProject;
  targetSectionId?: string;
  language?: 'en' | 'te';
  apiKey?: string;
  aiProvider?: string;
}): Promise<{
  success: boolean;
  project: WebsiteProject;
  changeSummary: string;
  targetedSectionId?: string;
}> {
  const res = await fetch(`${API_BASE_URL}/chat-edit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Chat edit failed with status ${res.status}`);
  }

  return await res.json();
}

export async function diagnoseCodeViaBackend(html: string, css: string = '') {
  const res = await fetch(`${API_BASE_URL}/repair/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, css }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Repair diagnostic failed with status ${res.status}`);
  }

  return await res.json();
}

export async function auditQualityViaBackend(html: string, css: string = '') {
  const res = await fetch(`${API_BASE_URL}/quality/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, css }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Quality audit failed with status ${res.status}`);
  }

  return await res.json();
}

export async function fetchProjectsFromBackend(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);

  const res = await fetch(`${API_BASE_URL}/projects?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch projects from backend');
  return await res.json();
}

export async function saveProjectToBackend(project: WebsiteProject) {
  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to save project to backend');
  return await res.json();
}

export async function deleteProjectFromBackend(projectId: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete project from backend');
  return await res.json();
}

// GitHub API Client
export async function fetchGithubStatus() {
  const res = await fetch(`${API_BASE_URL}/github/status`);
  if (!res.ok) return { connected: false, configured: false };
  return await res.json();
}

export async function fetchGithubUser(token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers['x-github-token'] = token;
  const res = await fetch(`${API_BASE_URL}/github/user`, { headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to authenticate GitHub user');
  }
  return await res.json();
}

export async function fetchGithubRepos(token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers['x-github-token'] = token;
  const res = await fetch(`${API_BASE_URL}/github/repos`, { headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch repositories');
  }
  return await res.json();
}

export async function scanFilesSecurityBackend(files: Record<string, string>) {
  const res = await fetch(`${API_BASE_URL}/github/scan-security`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files }),
  });
  if (!res.ok) throw new Error('Security scan failed');
  return await res.json();
}

export async function publishProjectToGithubBackend(payload: {
  projectId: string;
  projectName: string;
  repoName: string;
  isNewRepo?: boolean;
  branch?: string;
  commitMessage?: string;
  files: Record<string, string>;
  isPrivate?: boolean;
  token?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/github/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(payload.token ? { 'x-github-token': payload.token } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Publishing to GitHub failed');
  }
  return data;
}

export async function fetchGithubPublishHistory(projectId?: string) {
  const url = projectId ? `${API_BASE_URL}/github/history?projectId=${projectId}` : `${API_BASE_URL}/github/history`;
  const res = await fetch(url);
  if (!res.ok) return { history: [] };
  return await res.json();
}

// Live Deployment Client
export async function fetchDeploymentStatus() {
  const res = await fetch(`${API_BASE_URL}/deploy/status`);
  if (!res.ok) return { providers: { vercel: { configured: false }, netlify: { configured: false } } };
  return await res.json();
}

export async function triggerDeploymentBackend(payload: {
  projectId: string;
  projectName: string;
  provider: string;
  files: Record<string, string>;
  token?: string;
  branch?: string;
  commitHash?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/deploy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(payload.token ? { 'x-deploy-token': payload.token } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Deployment failed');
  }
  return data.deployment;
}

export async function fetchDeploymentHistoryBackend(projectId?: string) {
  const url = projectId ? `${API_BASE_URL}/deploy/history?projectId=${projectId}` : `${API_BASE_URL}/deploy/history`;
  const res = await fetch(url);
  if (!res.ok) return { deployments: [] };
  return await res.json();
}

// AI Marketing Assistant Client
export async function fetchMarketingStrategy(payload: {
  projectName: string;
  category: string;
  targetAudience?: string;
  keyBenefits?: string;
  websiteUrl?: string;
  language?: 'en' | 'te';
  projectContext?: any;
}) {
  const res = await fetch(`${API_BASE_URL}/marketing/strategy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate marketing strategy');
  }
  return data;
}

