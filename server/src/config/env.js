import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().optional().default(''),
  AI_PROVIDER: z.enum(['gemini', 'openai', 'mock']).default('mock'),
  AI_API_KEY: z.string().optional().default(''),
  AI_MODEL: z.string().optional().default(''),
  GITHUB_TOKEN: z.string().optional().default(''),
  GITHUB_CLIENT_ID: z.string().optional().default(''),
  GITHUB_CLIENT_SECRET: z.string().optional().default(''),
  VERCEL_TOKEN: z.string().optional().default(''),
  NETLIFY_AUTH_TOKEN: z.string().optional().default(''),
  RATE_LIMIT_MAX: z.coerce.number().default(60), // requests per window
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 mins
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[Config Error] Invalid environment variables:', parsed.error.format());
}

export const env = parsed.success ? parsed.data : {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || '',
  AI_PROVIDER: process.env.AI_PROVIDER || 'mock',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  VERCEL_TOKEN: process.env.VERCEL_TOKEN || '',
  NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN || '',
  RATE_LIMIT_MAX: 60,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
};

// Automatically detect active provider if API keys are present
export function resolveActiveAiProvider() {
  const selectedProvider = (process.env.AI_PROVIDER || env.AI_PROVIDER || '').toLowerCase();
  const geminiKey = process.env.GEMINI_API_KEY || (selectedProvider === 'gemini' ? env.AI_API_KEY : '');
  const openaiKey = process.env.OPENAI_API_KEY || (selectedProvider === 'openai' ? env.AI_API_KEY : '');

  // If explicitly requested OpenAI or OpenRouter key is configured
  if (selectedProvider === 'openai' && openaiKey && openaiKey.trim().length > 10) {
    const isOpenRouter = openaiKey.startsWith('sk-or-');
    return {
      provider: 'openai',
      apiKey: openaiKey.trim(),
      model: env.AI_MODEL || (isOpenRouter ? 'google/gemini-2.5-flash' : 'gpt-4o-mini'),
      isLive: true,
    };
  }

  // If explicitly requested Gemini
  if (selectedProvider === 'gemini' && geminiKey && geminiKey.trim().length > 10) {
    return {
      provider: 'gemini',
      apiKey: geminiKey.trim(),
      model: env.AI_MODEL || 'gemini-2.5-flash',
      isLive: true,
    };
  }

  // Auto-detect if AI_PROVIDER is not set or mock
  if (openaiKey && openaiKey.trim().length > 10 && selectedProvider !== 'mock') {
    const isOpenRouter = openaiKey.startsWith('sk-or-');
    return {
      provider: 'openai',
      apiKey: openaiKey.trim(),
      model: env.AI_MODEL || (isOpenRouter ? 'google/gemini-2.5-flash' : 'gpt-4o-mini'),
      isLive: true,
    };
  }

  if (geminiKey && geminiKey.trim().length > 10 && selectedProvider !== 'mock') {
    return {
      provider: 'gemini',
      apiKey: geminiKey.trim(),
      model: env.AI_MODEL || 'gemini-2.5-flash',
      isLive: true,
    };
  }

  // If explicit AI_PROVIDER is set to gemini or openai, or if keys exist and AI_PROVIDER is default
  if (geminiKey && geminiKey.trim().length > 10) {
    return {
      provider: 'gemini',
      apiKey: geminiKey.trim(),
      model: env.AI_MODEL || 'gemini-2.5-flash',
      isLive: true,
    };
  }

  if (openaiKey && openaiKey.trim().length > 10) {
    return {
      provider: 'openai',
      apiKey: openaiKey.trim(),
      model: env.AI_MODEL || 'gpt-4o-mini',
      isLive: true,
    };
  }

  return {
    provider: 'mock',
    apiKey: '',
    model: 'heuristic-engine-v1',
    isLive: false,
  };
}

export function getSanitizedConfig() {
  const ai = resolveActiveAiProvider();
  return {
    port: env.PORT,
    environment: env.NODE_ENV,
    frontendUrl: env.FRONTEND_URL,
    ai: {
      provider: ai.provider,
      model: ai.model,
      isLive: ai.isLive,
      hasKey: Boolean(ai.apiKey),
      keyMasked: ai.apiKey ? '••••••••' + ai.apiKey.slice(-4) : 'none',
    },
    database: {
      hasUri: Boolean(env.MONGODB_URI && env.MONGODB_URI.trim().length > 0),
      uriMasked: env.MONGODB_URI ? env.MONGODB_URI.replace(/:\/\/[^@]+@/, '://••••:••••@') : 'none',
    },
    integrations: {
      githubConfigured: Boolean((env.GITHUB_TOKEN && env.GITHUB_TOKEN.trim().length > 0) || (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)),
      githubOAuthConfigured: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
      vercelConfigured: Boolean(env.VERCEL_TOKEN && env.VERCEL_TOKEN.trim().length > 0),
      netlifyConfigured: Boolean(env.NETLIFY_AUTH_TOKEN && env.NETLIFY_AUTH_TOKEN.trim().length > 0),
    },
  };
}
