import { resolveActiveAiProvider } from '../../config/env.js';
import { GeminiProvider } from './geminiProvider.js';
import { OpenAiProvider } from './openaiProvider.js';
import { MockFallbackProvider } from './mockFallbackProvider.js';

export function getAiProvider(overrideKey = '', overrideProvider = '') {
  // If request passed custom API key from client settings
  if (overrideKey && overrideKey.trim().length > 10) {
    if (overrideProvider === 'openai' || overrideKey.startsWith('sk-')) {
      return new OpenAiProvider(overrideKey.trim());
    }
    return new GeminiProvider(overrideKey.trim());
  }

  // Check server environment configuration
  const active = resolveActiveAiProvider();

  if (active.provider === 'gemini') {
    return new GeminiProvider(active.apiKey, active.model);
  }

  if (active.provider === 'openai') {
    return new OpenAiProvider(active.apiKey, active.model);
  }

  // Fallback
  return new MockFallbackProvider();
}
