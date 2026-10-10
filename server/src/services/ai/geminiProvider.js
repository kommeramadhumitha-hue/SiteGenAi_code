import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAiProvider } from './aiProviderInterface.js';

export class GeminiProvider extends BaseAiProvider {
  constructor(apiKey, modelName = 'gemini-3.5-flash') {
    let resolvedModel = modelName || 'gemini-3.5-flash';
    if (resolvedModel === 'gemini-1.5-flash' || resolvedModel === 'gemini-2.5-flash') {
      resolvedModel = 'gemini-3.5-flash';
    }
    super('gemini', resolvedModel);
    this.apiKey = apiKey;
    this.isLive = true;
    this.genAi = new GoogleGenerativeAI(apiKey);
    // Ordered fallback models supported by Google Gemini
    this.fallbackModels = [
      resolvedModel,
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.7-flash',
      'gemini-3.8-flash',
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);
  }

  supportsVision() {
    return true;
  }

  async generateStructuredJson({
    systemPrompt,
    userPrompt,
    schemaDescription = '',
    maxTokens = 8192,
    temperature = 0.3,
  }) {
    const fullSystemInstruction = `${systemPrompt}\n\nIMPORTANT: You must return valid JSON strictly following this schema:\n${schemaDescription}`;

    let lastError = null;

    for (const candidateModel of this.fallbackModels) {
      try {
        const model = this.genAi.getGenerativeModel({
          model: candidateModel,
          systemInstruction: fullSystemInstruction,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature,
            maxOutputTokens: maxTokens,
          },
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();
        this.model = candidateModel;
        return JSON.parse(text);
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini] Model ${candidateModel} failed: ${err.message}. Trying next candidate...`);
      }
    }

    throw new Error(`Google Gemini Generation Failed: ${lastError ? lastError.message : 'All Gemini models exhausted'}`);
  }

  async visionAnalyze({ userPrompt, imageBase64, mimeType = 'image/png' }) {
    try {
      const model = this.genAi.getGenerativeModel({
        model: this.model,
        generationConfig: { responseMimeType: 'application/json' },
      });

      const imagePart = {
        inlineData: {
          data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
          mimeType,
        },
      };

      const prompt = `Analyze this UI sketch or screenshot. Extract the layout structure, color palette, navigation, and section contents:\n${userPrompt}`;
      const result = await model.generateContent([prompt, imagePart]);
      return JSON.parse(result.response.text());
    } catch (err) {
      throw new Error(`Gemini Vision Analysis Failed: ${err.message}`);
    }
  }
}
