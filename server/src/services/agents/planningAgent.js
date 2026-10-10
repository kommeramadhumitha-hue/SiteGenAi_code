export class PlanningAgent {
  constructor(aiProvider) {
    this.provider = aiProvider;
    this.role = 'Architecture & Planning Agent';
  }

  plan(requirements, requestedStyle = 'modern-minimal') {
    const { category, language } = requirements;

    // Check if user explicitly asked for dark background
    const lowerPrompt = requirements.userIntent.toLowerCase();
    const wantsDarkBg = lowerPrompt.includes('dark background') || lowerPrompt.includes('dark theme') || lowerPrompt.includes('black background') || requestedStyle === 'futuristic-dark';

    // Palette formulation
    let palette;
    if (wantsDarkBg) {
      palette = {
        id: 'cyber-dark',
        name: 'Cyber Violet & Blue Dark',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        background: '#070a13',
        surface: '#0f172a',
        text: '#f8fafc',
      };
    } else {
      switch (category) {
        case 'restaurant':
          palette = {
            id: 'tuscan-white',
            name: 'Classic Italian White & Crimson',
            primary: '#b91c1c',
            secondary: '#c2410c',
            accent: '#ea580c',
            background: '#ffffff',
            surface: '#fafaf9',
            text: '#1c1917',
          };
          break;
      case 'portfolio':
        palette = {
          id: 'clean-slate-blue',
          name: 'Professional Slate & Blue',
          primary: '#2563eb',
          secondary: '#1d4ed8',
          accent: '#0284c7',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#0f172a',
        };
        break;
      case 'education':
        palette = {
          id: 'emerald-mint',
          name: 'Fresh Emerald Mint',
          primary: '#059669',
          secondary: '#047857',
          accent: '#0d9488',
          background: '#ffffff',
          surface: '#f0fdf4',
          text: '#064e3b',
        };
        break;
      case 'agency':
        palette = {
          id: 'vibrant-indigo-violet',
          name: 'Vibrant Indigo & Violet Clean',
          primary: '#4f46e5',
          secondary: '#4338ca',
          accent: '#8b5cf6',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#172033',
        };
        break;
      default:
        palette = {
          id: 'modern-clean-indigo',
          name: 'Modern Clean Indigo',
          primary: '#4f46e5',
          secondary: '#4338ca',
          accent: '#8b5cf6',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#172033',
        };
      }
    }

    // Typography selection
    let fontFamily = 'Inter';
    if (category === 'restaurant') fontFamily = 'Poppins';
    if (category === 'portfolio') fontFamily = 'Outfit';
    if (category === 'agency') fontFamily = 'Plus Jakarta Sans';

    // Sequence of sections (Default is 100% free with no pricing paywall)
    const wantsPricing = lowerPrompt.includes('pricing') || lowerPrompt.includes('price') || lowerPrompt.includes('tier') || lowerPrompt.includes('plan');

    let sectionPlan = ['navbar', 'hero', 'features', 'statistics', 'testimonials', 'faq', 'contact', 'footer'];
    if (wantsPricing) {
      sectionPlan = ['navbar', 'hero', 'features', 'statistics', 'pricing', 'testimonials', 'faq', 'contact', 'footer'];
    }

    const wantsAbout = lowerPrompt.includes('about') || lowerPrompt.includes('story') || lowerPrompt.includes('chef') || lowerPrompt.includes('history');

    if (category === 'restaurant') {
      sectionPlan = ['navbar', 'hero', 'features', ...(wantsAbout ? ['about'] : []), 'testimonials', 'contact', 'footer'];
      if (wantsPricing) {
        sectionPlan.splice(3, 0, 'pricing');
      }
    } else if (category === 'portfolio') {
      sectionPlan = wantsPricing 
        ? ['navbar', 'hero', 'features', 'pricing', 'testimonials', 'contact', 'footer']
        : ['navbar', 'hero', 'features', 'testimonials', 'contact', 'footer'];
    }

    return {
      style: requestedStyle,
      palette,
      fontFamily,
      sectionPlan,
      language,
    };
  }
}
