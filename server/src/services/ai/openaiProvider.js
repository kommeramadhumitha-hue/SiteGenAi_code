import OpenAI from 'openai';
import { BaseAiProvider } from './aiProviderInterface.js';

export class OpenAiProvider extends BaseAiProvider {
  constructor(apiKey, modelName = 'gpt-4o-mini', baseURL = '') {
    const isOpenRouter = apiKey.startsWith('sk-or-') || Boolean(baseURL);
    const resolvedBaseURL = baseURL || (apiKey.startsWith('sk-or-') ? 'https://openrouter.ai/api/v1' : undefined);
    const resolvedModel = modelName || (isOpenRouter ? 'google/gemini-2.5-flash' : 'gpt-4o-mini');
    super(isOpenRouter ? 'openrouter' : 'openai', resolvedModel);
    this.apiKey = apiKey;
    this.isLive = true;
    this.isOpenRouter = isOpenRouter;
    this.client = new OpenAI({
      apiKey,
      ...(resolvedBaseURL ? { baseURL: resolvedBaseURL } : {}),
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'SiteGen AI',
      },
    });
  }

  supportsVision() {
    return true;
  }

  async generateStructuredJson({
    systemPrompt,
    userPrompt,
    schemaDescription = '',
    maxTokens = 3000,
    temperature = 0.3,
  }) {
    const fullSystem = `${systemPrompt}\n\nYou MUST respond with valid JSON strictly adhering to this schema:\n${schemaDescription}`;
    // OpenRouter credit reservation guard: bound maxTokens to 1200 to avoid 402 reservation rejections on low balances
    const effectiveMaxTokens = this.isOpenRouter ? Math.min(maxTokens, 1200) : maxTokens;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: fullSystem },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        max_tokens: effectiveMaxTokens,
        temperature,
      });

      const content = response.choices[0]?.message?.content;
      return JSON.parse(content);
    } catch (firstErr) {
      console.warn('[OpenAI] First attempt failed. Retrying with bounded fallback...', firstErr.message);

      // If error is 402 credits/max_tokens error, lower max_tokens immediately
      let retryTokens = Math.min(effectiveMaxTokens, 1000);
      if (firstErr.message && firstErr.message.includes('402')) {
        const affordMatch = firstErr.message.match(/afford (\d+)/);
        if (affordMatch && affordMatch[1]) {
          retryTokens = Math.max(300, parseInt(affordMatch[1], 10) - 100);
        }
      }

      try {
        const retry = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: fullSystem },
            { role: 'user', content: `${userPrompt}\n\nFix error and return valid JSON:\n${firstErr.message}` },
          ],
          response_format: { type: 'json_object' },
          max_tokens: retryTokens,
          temperature,
        });

        return JSON.parse(retry.choices[0]?.message?.content);
      } catch (retryErr) {
        throw new Error(`OpenAI API Generation Failed: ${retryErr.message}`);
      }
    }
  }

  async visionAnalyze({ userPrompt, imageBase64, mimeType = 'image/png' }) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      const imageUrl = `data:${mimeType};base64,${cleanBase64}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `Analyze this wireframe/sketch and return JSON layout:\n${userPrompt}` },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0]?.message?.content);
    } catch (err) {
      throw new Error(`OpenAI Vision Analysis Failed: ${err.message}`);
    }
  }
}
