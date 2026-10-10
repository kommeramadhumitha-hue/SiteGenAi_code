import { MockFallbackProvider } from '../ai/mockFallbackProvider.js';

export class GenerationAgent {
  constructor(aiProvider) {
    this.provider = aiProvider;
    this.fallbackProvider = new MockFallbackProvider();
    this.role = 'Code & Content Generation Agent';
  }

  async generate(requirements, plan) {
    const { userIntent, category, language } = requirements;
    const { palette, fontFamily, style, sectionPlan } = plan;
    let fallbackError = null;

    // If using live LLM provider (Gemini or OpenAI)
    if (this.provider.isLive) {
      const systemPrompt = `You are SiteGen AI's Senior Frontend Architect.
Generate a complete, production-ready website specification for the following user request.
Language for all user-visible text: ${language === 'te' ? 'Telugu (తెలుగు)' : 'English'}.
Category: ${category}.
Design Style: ${style}.
Sections to include: ${sectionPlan.join(', ')}.

Rules:
1. Every section must have a unique ID (e.g. "sec-hero-1", "sec-feat-1").
2. Content must be rich, concrete, and relevant to the user's vision. No placeholder lorem ipsum.
3. Every pricing tier, feature card, or testimonial must have full details.
4. Return pure JSON matching the specified schema.`;

      const schemaDescription = `{
  "name": "string (brand/project title)",
  "category": "${category}",
  "style": "${style}",
  "fontFamily": "${fontFamily}",
  "palette": {
    "id": "${palette.id}",
    "name": "${palette.name}",
    "primary": "${palette.primary}",
    "secondary": "${palette.secondary}",
    "accent": "${palette.accent}",
    "background": "${palette.background}",
    "surface": "${palette.surface}",
    "text": "${palette.text}"
  },
  "sections": [
    {
      "id": "string",
      "type": "navbar|hero|features|about|product|pricing|testimonials|statistics|gallery|team|faq|blog|contact|newsletter|cta|footer",
      "title": "string",
      "isVisible": true,
      "content": {
        "headline": "string",
        "subheadline": "string",
        "badge": "string (optional)",
        "primaryCtaText": "string (optional)",
        "primaryCtaUrl": "string (optional)",
        "items": [
          { "title": "string", "description": "string", "icon": "string", "price": "string" }
        ]
      }
    }
  ]
}`;

      try {
        const result = await this.provider.generateStructuredJson({
          systemPrompt,
          userPrompt: `Build website: "${userIntent}"`,
          schemaDescription,
          maxTokens: 2800,
        });

        // Ensure planned palette, fonts, and styles are respected
        result.name = result.name || result.title || this.fallbackProvider._deriveName(userIntent, category);
        result.palette = palette || result.palette;
        result.fontFamily = result.fontFamily || fontFamily;
        result.style = result.style || style;
        result.category = result.category || category;
        result.prompt = userIntent;

        return {
          ...result,
          _meta: {
            isSimulated: false,
            provider: `${this.provider.name} (${this.provider.model})`,
            generatedAt: new Date().toISOString(),
          },
        };
      } catch (err) {
        console.warn(`[GenerationAgent] Live provider ${this.provider.name} error: ${err.message}. Falling back to deterministic engine.`);
        fallbackError = err.message;
      }
    }

    // Deterministic fallback generator (honestly labeled)
    const result = await this.fallbackProvider.generateStructuredJson({
      systemPrompt: 'Generate website',
      userPrompt: userIntent,
    });

    result.palette = result.palette || palette;
    result.fontFamily = result.fontFamily || fontFamily;
    result.style = result.style || style;
    result.category = result.category || category;
    result.prompt = userIntent;

    if (fallbackError) {
      result._meta = {
        isSimulated: true,
        provider: 'SiteGen Heuristic Engine (Fallback due to Gemini Error)',
        error: fallbackError,
        fallbackReason: `Gemini live call encountered an error: ${fallbackError}`,
        generatedAt: new Date().toISOString(),
      };
    }

    return result;
  }
}
