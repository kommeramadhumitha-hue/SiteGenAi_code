export class RequirementAgent {
  constructor(aiProvider) {
    this.provider = aiProvider;
    this.role = 'Requirement Analysis Agent';
  }

  async analyze(userPrompt, requestedCategory = 'saas', language = 'en') {
    const isTelugu = language === 'te' || /[\u0C00-\u0C7F]/.test(userPrompt);
    const lower = (userPrompt || '').toLowerCase();

    // Determine category if not explicitly forced
    let detectedCategory = requestedCategory;
    if (lower.includes('restaurant') || lower.includes('pizza') || lower.includes('coffee') || lower.includes('food') || lower.includes('రెస్టారెంట్')) {
      detectedCategory = 'restaurant';
    } else if (lower.includes('portfolio') || lower.includes('resume') || lower.includes('cv') || lower.includes('పోర్ట్‌ఫోలియో')) {
      detectedCategory = 'portfolio';
    } else if (lower.includes('agency') || lower.includes('studio') || lower.includes('marketing')) {
      detectedCategory = 'agency';
    } else if (lower.includes('shop') || lower.includes('store') || lower.includes('ecommerce') || lower.includes('audio')) {
      detectedCategory = 'ecommerce';
    } else if (lower.includes('course') || lower.includes('school') || lower.includes('bootcamp') || lower.includes('education')) {
      detectedCategory = 'education';
    }

    // Determine tone
    let tone = 'modern & tech-forward';
    if (detectedCategory === 'restaurant') tone = 'warm, appetizing, hospitable';
    if (detectedCategory === 'portfolio') tone = 'clean, creative, professional';
    if (detectedCategory === 'education') tone = 'informative, empowering, structured';

    return {
      category: detectedCategory,
      language: isTelugu ? 'te' : 'en',
      tone,
      userIntent: userPrompt,
      mustHaveSections: ['navbar', 'hero', 'features', 'contact', 'footer'],
    };
  }
}
