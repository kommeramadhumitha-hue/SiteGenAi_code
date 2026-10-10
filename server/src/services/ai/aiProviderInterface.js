/**
 * Standard AI Provider Interface
 * All model integrations (Gemini, OpenAI, Fallback) implement this contract.
 */
export class BaseAiProvider {
  constructor(name, model) {
    this.name = name;
    this.model = model;
    this.isLive = false;
  }

  async generateStructuredJson({ systemPrompt, userPrompt, schemaDescription, maxTokens = 4000, temperature = 0.4 }) {
    throw new Error('generateStructuredJson must be implemented by provider');
  }

  async visionAnalyze({ userPrompt, imageBase64, mimeType = 'image/png' }) {
    throw new Error('visionAnalyze must be implemented by provider');
  }

  supportsVision() {
    return false;
  }
}
