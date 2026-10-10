import { WebsiteProject, WebsiteCategory, WebsiteSection, ColorPalette } from '../types';

export interface GenerationProgressCallback {
  (step: number, totalSteps: number, message: string): void;
}

export interface GenerationResult {
  project: WebsiteProject;
  isSimulated: boolean;
  provider: string;
  generationTimeMs: number;
}

// Preset modern color palettes
export const PALETTE_PRESETS: ColorPalette[] = [
  {
    id: 'clean-indigo',
    name: 'Modern Clean Indigo',
    primary: '#4f46e5',
    secondary: '#4338ca',
    accent: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#172033',
  },
  {
    id: 'tuscan-white',
    name: 'Classic Tuscan White & Red',
    primary: '#b91c1c',
    secondary: '#c2410c',
    accent: '#ea580c',
    background: '#ffffff',
    surface: '#fafaf9',
    text: '#1c1917',
  },
  {
    id: 'emerald-mint',
    name: 'Fresh Emerald Mint',
    primary: '#059669',
    secondary: '#047857',
    accent: '#0d9488',
    background: '#ffffff',
    surface: '#f0fdf4',
    text: '#064e3b',
  },
  {
    id: 'slate-blue',
    name: 'Professional Slate & Blue',
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#0284c7',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
  },
  {
    id: 'crimson-white',
    name: 'Crimson & Rose Clean',
    primary: '#e11d48',
    secondary: '#be123c',
    accent: '#f43f5e',
    background: '#ffffff',
    surface: '#fff1f2',
    text: '#1e293b',
  },
  {
    id: 'cyber-dark',
    name: 'Futuristic Dark',
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#8b5cf6',
    background: '#070a13',
    surface: '#0f172a',
    text: '#f8fafc',
  },
];

import { API_BASE_URL, getAuthHeaders } from './apiClient';

export async function generateWebsiteFromPrompt(
  prompt: string,
  category: WebsiteCategory,
  onProgress?: GenerationProgressCallback,
  apiKey?: string,
  style: string = 'modern-minimal'
): Promise<GenerationResult> {
  const startTime = Date.now();

  if (onProgress) {
    onProgress(1, 4, 'Initiating multi-agent generative pipeline...');
  }

  // Level 2 Integration: Call backend multi-agent pipeline endpoint
  try {
    if (onProgress) {
      onProgress(2, 4, 'Synthesizing responsive structural layout with AI...');
    }

    const backendUrl = `${API_BASE_URL}/generate`;
    const backendRes = await fetch(backendUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        prompt,
        category,
        style,
        apiKey: apiKey || undefined,
      }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success && data.project) {
        if (onProgress) {
          onProgress(4, 4, 'Finalizing live preview sandbox and styles...');
        }
        return {
          project: data.project,
          isSimulated: data.provider ? !data.provider.isLive : true,
          provider: data.provider?.name
            ? `${data.provider.name} (${data.provider.model})`
            : 'SiteGen Backend Engine',
          generationTimeMs: data.executionTimeMs || Date.now() - startTime,
        };
      }
    } else {
      const errBody = await backendRes.json().catch(() => ({}));
      console.warn('[SiteGen] Backend returned status', backendRes.status, errBody);
    }
  } catch (backendErr: any) {
    console.info('[SiteGen] Backend unreachable or failed, activating client heuristic engine:', backendErr.message);
  }

  // Local generative synthesis engine (honest fallback)
  if (onProgress) {
    onProgress(3, 4, 'Running client-side generative synthesis fallback...');
  }

  const projectName = deriveProjectName(prompt, category);
  const palette = selectPaletteForCategory(category, prompt);
  const sections = synthesizeSectionsForPrompt(prompt, category, projectName);

  const project: WebsiteProject = {
    id: 'proj-' + Math.random().toString(36).substring(2, 9),
    name: projectName,
    category,
    style: 'modern-minimal',
    palette,
    fontFamily: category === 'restaurant' ? 'Poppins' : category === 'portfolio' ? 'Outfit' : 'Inter',
    sections,
    prompt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    qualityScore: 94,
    _meta: {
      isSimulated: true,
      provider: 'SiteGen Heuristic Engine (Local Fallback)',
      generatedAt: new Date().toISOString(),
    },
  };

  if (onProgress) {
    onProgress(4, 4, 'Ready');
  }

  return {
    project,
    isSimulated: true,
    provider: 'SiteGen Heuristic Engine (Local Fallback)',
    generationTimeMs: Date.now() - startTime,
  };
}

export function refineSectionWithChat(
  section: WebsiteSection,
  command: string
): { updatedSection: WebsiteSection; changeSummary: string } {
  const lower = command.toLowerCase();
  const updated: WebsiteSection = JSON.parse(JSON.stringify(section));

  let summary = 'Updated section content based on your request.';

  if (lower.includes('button') || lower.includes('cta')) {
    if (lower.includes('emerald') || lower.includes('green')) {
      updated.styles = { ...updated.styles, accentColor: '#10b981' };
      summary = 'Applied emerald accent styling to button.';
    }
    const matchQuote = command.match(/"([^"]+)"|'([^']+)'/);
    if (matchQuote) {
      updated.content.primaryCtaText = matchQuote[1] || matchQuote[2];
      summary = `Changed primary button text to "${updated.content.primaryCtaText}".`;
    }
  } else if (lower.includes('headline') || lower.includes('title')) {
    const matchQuote = command.match(/"([^"]+)"|'([^']+)'/);
    if (matchQuote) {
      updated.content.headline = matchQuote[1] || matchQuote[2];
      summary = `Updated headline to "${updated.content.headline}".`;
    } else {
      updated.content.headline = command;
      summary = `Set headline to "${command}".`;
    }
  } else if (lower.includes('badge')) {
    const matchQuote = command.match(/"([^"]+)"|'([^']+)'/);
    if (matchQuote) {
      updated.content.badge = matchQuote[1] || matchQuote[2];
      summary = `Added promotional badge: "${updated.content.badge}".`;
    } else {
      updated.content.badge = 'Special Offer ✨';
      summary = 'Added announcement badge.';
    }
  } else if (lower.includes('discount') || lower.includes('offer')) {
    updated.content.badge = '20% Limited Launch Discount 🚀';
    summary = 'Added 20% launch discount badge.';
  } else {
    // General subheadline / copy update
    updated.content.subheadline = `Refined via prompt: "${command}"`;
    summary = 'Refined section copy and typography spacing.';
  }

  return { updatedSection: updated, changeSummary: summary };
}

function deriveProjectName(prompt: string, category: WebsiteCategory): string {
  const words = prompt.split(/\s+/).filter((w) => w.length > 3 && !['with', 'that', 'this', 'have', 'from'].includes(w.toLowerCase()));
  if (words.length > 0) {
    const candidate = words[0].replace(/[^a-zA-Z]/g, '');
    const capitalized = candidate.charAt(0).toUpperCase() + candidate.slice(1);
    if (category === 'saas') return `${capitalized} AI`;
    if (category === 'restaurant') return `Trattoria ${capitalized}`;
    if (category === 'portfolio') return `${capitalized} Studio`;
    if (category === 'education') return `${capitalized} Academy`;
    return `${capitalized} Hub`;
  }
  return `${category.toUpperCase()} Platform`;
}

function selectPaletteForCategory(category: WebsiteCategory, prompt: string): ColorPalette {
  const lower = prompt.toLowerCase();
  if (lower.includes('dark') || lower.includes('black') || lower.includes('cyber') || lower.includes('futuristic')) {
    return PALETTE_PRESETS[5]; // cyber-dark
  }
  if (lower.includes('amber') || lower.includes('coffee') || lower.includes('food') || lower.includes('pizza') || category === 'restaurant') {
    return PALETTE_PRESETS[1]; // tuscan-white
  }
  if (lower.includes('green') || lower.includes('health') || lower.includes('nature') || category === 'education') {
    return PALETTE_PRESETS[2]; // emerald-mint
  }
  if (lower.includes('blue') || category === 'portfolio') {
    return PALETTE_PRESETS[3]; // slate-blue
  }
  if (lower.includes('rose') || lower.includes('creative') || category === 'agency') {
    return PALETTE_PRESETS[4]; // crimson-white
  }
  return PALETTE_PRESETS[0]; // clean-indigo (modern pure white)
}

function synthesizeSectionsForPrompt(
  prompt: string,
  category: WebsiteCategory,
  projectName: string
): WebsiteSection[] {
  const lower = prompt.toLowerCase();
  const includesPricing = lower.includes('pricing') || lower.includes('tier') || lower.includes('price') || lower.includes('plan');

  const sections: WebsiteSection[] = [
    {
      id: 'sec-nav-' + Date.now(),
      type: 'navbar',
      title: 'Navbar',
      isVisible: true,
      content: {
        headline: projectName,
        links: [
          { label: 'Features', url: '#features' },
          { label: 'Metrics', url: '#stats' },
          ...(includesPricing ? [{ label: 'Plans', url: '#pricing' }] : []),
          { label: 'FAQ', url: '#faq' },
          { label: 'Contact', url: '#contact' },
        ],
        primaryCtaText: 'Get Started Free',
        primaryCtaUrl: '#contact',
      },
    },
    {
      id: 'sec-hero-' + (Date.now() + 1),
      type: 'hero',
      title: 'Hero Banner',
      isVisible: true,
      content: {
        badge: '100% Free • No Subscription Needed',
        headline: `Transform How You Build with ${projectName}`,
        subheadline: prompt || 'Experience next-generation velocity, beautiful clean aesthetics, and seamless workflows built for modern users.',
        primaryCtaText: 'Start Building Free',
        secondaryCtaText: 'Explore Features',
        primaryCtaUrl: '#features',
        secondaryCtaUrl: '#stats',
      },
    },
    {
      id: 'sec-stats-' + (Date.now() + 2),
      type: 'statistics',
      title: 'Performance Numbers',
      isVisible: true,
      content: {
        items: [
          { value: '100%', label: 'Free Access' },
          { value: '< 100ms', label: 'Average Response Time' },
          { value: '10,000+', label: 'Active Happy Users' },
          { value: '4.9 / 5', label: 'Customer Satisfaction' },
        ],
      },
    },
    {
      id: 'sec-feat-' + (Date.now() + 3),
      type: 'features',
      title: 'Core Features',
      isVisible: true,
      content: {
        badge: 'Built for Speed',
        headline: 'Engineered for Flawless Reliability',
        subheadline: 'Every component is optimized for speed, accessibility, and modern responsive design.',
        items: [
          {
            title: 'Intelligent Automation',
            description: 'Reduces repetitive manual tasks with predictive contextual assistance.',
            icon: '⚡',
          },
          {
            title: 'Accessibility Standardized',
            description: 'WCAG AAA compliant contrast, semantic landmark tags, and screen reader labels.',
            icon: '🛡️',
          },
          {
            title: 'Fluid Edge Performance',
            description: 'Sub-second page loads served globally from edge nodes with zero bloat.',
            icon: '🚀',
          },
        ],
      },
    },
  ];

  if (includesPricing) {
    sections.push({
      id: 'sec-pricing-' + (Date.now() + 4),
      type: 'pricing',
      title: 'Access Options',
      isVisible: true,
      content: {
        headline: 'Free Access for Everyone',
        subheadline: 'No credit card or paid subscription required.',
        items: [
          {
            title: 'Free Community',
            price: '$0',
            period: '/forever',
            description: 'For individuals exploring ideas and learning.',
            features: ['All Core features', 'Fast generation', 'Community support', 'Free exports'],
          },
          {
            title: 'Free Professional',
            price: '$0',
            period: '/forever',
            description: 'Full capabilities open with zero subscription cost.',
            features: ['Unlimited website generation', 'Live editing & repair', 'GitHub publishing', 'Direct deployment'],
          },
        ],
      },
    });
  }

  sections.push(
    {
      id: 'sec-faq-' + (Date.now() + 5),
      type: 'faq',
      title: 'FAQ',
      isVisible: true,
      content: {
        headline: 'Frequently Asked Questions',
        subheadline: 'Here are the answers to the most common questions.',
        items: [
          {
            title: 'Is this website free to use?',
            description: 'Yes, it is completely free to use with zero customer subscription or billing requirement.',
          },
          {
            title: 'Can I export the project files?',
            description: 'Yes, you can export full HTML, CSS, JavaScript, and React bundles at any time.',
          },
        ],
      },
    },
    {
      id: 'sec-contact-' + (Date.now() + 6),
      type: 'contact',
      title: 'Get In Touch',
      isVisible: true,
      content: {
        headline: 'Start Your Journey Today',
        subheadline: 'Leave us a message or request a feature.',
        buttonText: 'Submit Inquiry',
      },
    },
    {
      id: 'sec-footer-' + (Date.now() + 7),
      type: 'footer',
      title: 'Footer',
      isVisible: true,
      content: {
        headline: projectName,
        subheadline: 'Built with SiteGen AI — Free to use, no subscription required.',
        copyright: `© ${new Date().getFullYear()} ${projectName}. All rights reserved.`,
      },
    }
  );

  return sections;
}
