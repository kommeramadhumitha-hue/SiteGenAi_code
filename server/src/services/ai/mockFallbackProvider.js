import { BaseAiProvider } from './aiProviderInterface.js';

export class MockFallbackProvider extends BaseAiProvider {
  constructor() {
    super('mock', 'heuristic-engine-v1');
    this.isLive = false;
  }

  supportsVision() {
    return false;
  }

  async generateStructuredJson({ systemPrompt, userPrompt, schemaDescription }) {
    // Artificial latency to simulate model inference
    await new Promise((r) => setTimeout(r, 650));

    const lower = (userPrompt || '').toLowerCase();
    const isTelugu = /[\u0C00-\u0C7F]/.test(userPrompt) || lower.includes('telugu') || lower.includes('తెలుగు');

    // Categorization logic
    let category = 'saas';
    if (lower.includes('coffee') || lower.includes('restaurant') || lower.includes('food') || lower.includes('రెస్టారెంట్') || lower.includes('కాఫీ')) {
      category = 'restaurant';
    } else if (lower.includes('portfolio') || lower.includes('designer') || lower.includes('developer') || lower.includes('పోర్ట్‌ఫోలియో')) {
      category = 'portfolio';
    } else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('health') || lower.includes('వైద్యం')) {
      category = 'business';
    } else if (lower.includes('learn') || lower.includes('course') || lower.includes('academy') || lower.includes('విద్య')) {
      category = 'education';
    } else if (lower.includes('store') || lower.includes('shop') || lower.includes('ecommerce') || lower.includes('దుకాణం')) {
      category = 'ecommerce';
    } else if (lower.includes('agency') || lower.includes('studio')) {
      category = 'agency';
    }

    const projectName = isTelugu ? 'నవోదయ ప్లాట్‌ఫారమ్' : this._deriveName(userPrompt, category);
    const palette = this._derivePalette(category, lower);

    return {
      name: projectName,
      category,
      style: 'modern-minimal',
      fontFamily: category === 'restaurant' ? 'Poppins' : 'Inter',
      palette,
      prompt: userPrompt,
      sections: this._generateSections(projectName, category, isTelugu, userPrompt),
      _meta: {
        isSimulated: true,
        provider: 'SiteGen Heuristic Engine (Setup GEMINI_API_KEY or OPENAI_API_KEY in server/.env for Live LLM)',
        generatedAt: new Date().toISOString(),
      },
    };
  }

  async visionAnalyze({ userPrompt }) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      error: 'Vision feature requires a configured Live LLM model (Google Gemini 1.5 Flash or OpenAI GPT-4o). Set GEMINI_API_KEY in server/.env to activate wireframe image analysis.',
      isSimulated: true,
    };
  }

  _deriveName(prompt, category) {
    const words = prompt.split(/\s+/).filter((w) => w.length > 3 && !['with', 'that', 'from', 'this', 'have', 'create', 'build'].includes(w.toLowerCase()));
    if (words.length > 0) {
      const w = words[0].replace(/[^a-zA-Z]/g, '');
      const cap = w.charAt(0).toUpperCase() + w.slice(1);
      if (category === 'saas') return `${cap} AI`;
      if (category === 'restaurant') return `Trattoria ${cap}`;
      if (category === 'portfolio') return `${cap} Studio`;
      if (category === 'education') return `${cap} Academy`;
      return `${cap} Hub`;
    }
    return `${category.toUpperCase()} Platform`;
  }

  _derivePalette(category, lower) {
    if (lower.includes('dark') || lower.includes('black') || lower.includes('cyber') || lower.includes('futuristic')) {
      return {
        id: 'cyber-dark',
        name: 'Cyber Violet & Blue Dark',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        background: '#070a13',
        surface: '#0f172a',
        text: '#f8fafc',
      };
    }
    if (lower.includes('amber') || lower.includes('coffee') || lower.includes('food') || lower.includes('pizza') || category === 'restaurant') {
      return {
        id: 'tuscan-white',
        name: 'Classic Italian White & Crimson',
        primary: '#b91c1c',
        secondary: '#c2410c',
        accent: '#ea580c',
        background: '#ffffff',
        surface: '#fafaf9',
        text: '#1c1917',
      };
    }
    if (lower.includes('green') || lower.includes('emerald') || category === 'education') {
      return {
        id: 'emerald-mint',
        name: 'Fresh Emerald Mint',
        primary: '#059669',
        secondary: '#047857',
        accent: '#0d9488',
        background: '#ffffff',
        surface: '#f0fdf4',
        text: '#064e3b',
      };
    }
    if (lower.includes('cyan') || category === 'portfolio') {
      return {
        id: 'clean-slate-blue',
        name: 'Professional Slate & Blue',
        primary: '#2563eb',
        secondary: '#1d4ed8',
        accent: '#0284c7',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
      };
    }
    return {
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

  _generateSections(name, category, isTelugu, rawPrompt) {
    const promptLower = (rawPrompt || '').toLowerCase();
    const wantsPricing = promptLower.includes('pricing') || promptLower.includes('price') || promptLower.includes('tier') || promptLower.includes('plan') || promptLower.includes('ధర');

    if (isTelugu) {
      const teluguSections = [
        {
          id: 'sec-nav-' + Date.now(),
          type: 'navbar',
          title: 'నావిగేషన్ బార్',
          isVisible: true,
          content: {
            headline: name,
            links: [
              { label: 'విశేషాలు', url: '#features' },
              ...(wantsPricing ? [{ label: 'ధరలు', url: '#pricing' }] : []),
              { label: 'సంప్రదించండి', url: '#contact' },
            ],
            primaryCtaText: 'ప్రారంభించండి',
            primaryCtaUrl: '#contact',
          },
        },
        {
          id: 'sec-hero-' + (Date.now() + 1),
          type: 'hero',
          title: 'హీరో సెక్షన్',
          isVisible: true,
          content: {
            badge: 'AI ఆధారిత సాంకేతికత',
            headline: `${name} తో మీ వ్యాపారాన్ని తదుపరి స్థాయికి తీసుకెళ్లండి`,
            subheadline: rawPrompt || 'అధునాతన సాధనాలు, వేగవంతమైన పనితీరు మరియు ఆకర్షణీయమైన డిజైన్‌తో మీ కోసం రూపొందించబడింది.',
            primaryCtaText: 'ఉచితంగా ప్రారంభించండి',
            secondaryCtaText: 'మరింత తెలుసుకోండి',
            primaryCtaUrl: '#contact',
            secondaryCtaUrl: '#features',
          },
        },
        {
          id: 'sec-feat-' + (Date.now() + 2),
          type: 'features',
          title: 'ముఖ్య ఫీచర్లు',
          isVisible: true,
          content: {
            headline: 'సామర్థ్యం మరియు భద్రత',
            subheadline: 'మీ అవసరాలకు తగిన విధంగా ఆధునిక డిజైన్.',
            items: [
              { title: 'వేగవంతమైన పనితీరు', description: 'సబ్‌సెకన్ స్పందన వేగం మరియు 99.9% విశ్వసనీయత.', icon: '⚡' },
              { title: 'మొబైల్ రెస్పాన్సివ్', description: 'అన్ని స్క్రీన్లలో స్పష్టమైన మరియు సులభమైన వీక్షణ.', icon: '📱' },
              { title: 'పూర్తి భద్రత', description: 'అత్యున్నత ప్రమాణాలతో కూడిన ఎన్‌క్రిప్షన్.', icon: '🛡️' },
            ],
          },
        },
      ];

      if (wantsPricing) {
        teluguSections.push({
          id: 'sec-pricing-' + (Date.now() + 3),
          type: 'pricing',
          title: 'ధరల పట్టిక',
          isVisible: true,
          content: {
            headline: '100% ఉచిత ప్రాప్యత',
            subheadline: 'ఎటువంటి రుసుము లేదా సబ్‌స్క్రిప్షన్ లేదు.',
            items: [
              { title: 'కమ్యూనిటీ ఉచితం', price: '₹0', period: '/ఎల్లప్పుడూ', description: 'వ్యక్తిగత అవసరాల కోసం.', features: ['పూర్తి ప్రాప్యత', 'కమ్యూనిటీ మద్దతు'] },
              { title: 'ప్రొఫెషనల్ ఉచితం', price: '₹0', period: '/ఎల్లప్పుడూ', description: 'బృందాల కోసం.', features: ['అపరిమిత ప్రాప్యత', 'డౌన్‌లోడ్ ఎంపికలు', 'రిపేర్ స్టూడియో'] },
            ],
          },
        });
      }

      teluguSections.push(
        {
          id: 'sec-contact-' + (Date.now() + 4),
          type: 'contact',
          title: 'సంప్రదింపు ఫారమ్',
          isVisible: true,
          content: {
            headline: 'మమ్మల్ని సంప్రదించండి',
            subheadline: 'మీ ప్రశ్నలు మరియు సలహాల కోసం సందేశం పంపండి.',
            buttonText: 'సందేశం పంపు',
          },
        },
        {
          id: 'sec-footer-' + (Date.now() + 5),
          type: 'footer',
          title: 'ఫుటర్',
          isVisible: true,
          content: {
            headline: name,
            subheadline: 'సైట్‌జెన్ AI ద్వారా రూపొందించబడింది.',
            copyright: `© ${new Date().getFullYear()} ${name}. సర్వహక్కులు ప్రత్యేకించబడ్డాయి.`,
          },
        }
      );

      return teluguSections;
    }

    const englishSections = [
      {
        id: 'sec-nav-' + Date.now(),
        type: 'navbar',
        title: 'Header Navigation',
        isVisible: true,
        content: {
          headline: name,
          links: [
            { label: 'Capabilities', url: '#features' },
            { label: 'Metrics', url: '#stats' },
            ...(wantsPricing ? [{ label: 'Access', url: '#pricing' }] : []),
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
        title: 'Hero Statement',
        isVisible: true,
        content: {
          badge: '100% Free • No Subscription Needed',
          headline: `Empowering Next-Generation Experiences with ${name}`,
          subheadline: rawPrompt || 'Scale your brand with sub-second performance, intuitive user design, and production-ready reliability.',
          primaryCtaText: 'Start Building Free',
          secondaryCtaText: 'Explore Features',
          primaryCtaUrl: '#contact',
          secondaryCtaUrl: '#features',
        },
      },
      {
        id: 'sec-stats-' + (Date.now() + 2),
        type: 'statistics',
        title: 'Platform Statistics',
        isVisible: true,
        content: {
          items: [
            { value: '99.98%', label: 'Uptime Reliability' },
            { value: '< 25ms', label: 'Average Latency' },
            { value: '25,000+', label: 'Active Users' },
            { value: '4.9 / 5', label: 'Verified Reviews' },
          ],
        },
      },
      {
        id: 'sec-feat-' + (Date.now() + 3),
        type: 'features',
        title: 'Core Features',
        isVisible: true,
        content: {
          badge: 'Engineered for Performance',
          headline: 'High-Impact Capabilities Built for Scale',
          subheadline: 'Everything you need to launch and operate without friction.',
          items: [
            {
              title: 'Sub-second Load Times',
              description: 'Optimized static assets distributed across edge CDN locations globally.',
              icon: '⚡',
            },
            {
              title: 'WCAG AAA Accessibility',
              description: 'Screen reader aria labels, semantic hierarchy, and contrast-verified color tokens.',
              icon: '🛡️',
            },
            {
              title: 'Adaptive Mobile Fluidity',
              description: 'Responsive container systems that scale seamlessly from smartphones to ultra-wide displays.',
              icon: '📱',
            },
          ],
        },
      },
    ];

    if (wantsPricing) {
      englishSections.push({
        id: 'sec-pricing-' + (Date.now() + 4),
        type: 'pricing',
        title: 'Access Options',
        isVisible: true,
        content: {
          headline: 'Free Access for Everyone',
          subheadline: 'No customer subscription or billing requirement.',
          items: [
            {
              title: 'Community Free',
              price: '$0',
              period: '/forever',
              description: 'For individuals exploring ideas and learning.',
              features: ['Complete website generation', 'Live editing & repair', 'Free project downloads', 'Standard support'],
            },
            {
              title: 'Professional Free',
              price: '$0',
              period: '/forever',
              description: 'Full capabilities open with zero subscription cost.',
              features: ['Unlimited website generation', 'Live editing & repair', 'GitHub publishing', 'Direct deployment'],
            },
          ],
        },
      });
    }

    englishSections.push(
      {
        id: 'sec-testimonials-' + (Date.now() + 5),
        type: 'testimonials',
        title: 'Customer Feedback',
        isVisible: true,
        content: {
          headline: 'Loved by Builders Globally',
          subheadline: 'Here is what teams say about their experience.',
          items: [
            {
              author: 'Aarav Mehta',
              role: 'Product Lead @ Omnia',
              description: 'SiteGen cut our design-to-production turnaround from weeks to hours.',
            },
            {
              author: 'Samantha Wu',
              role: 'Creative Director @ StudioFlux',
              description: 'The code quality is exceptionally clean with zero unnecessary dependencies.',
            },
          ],
        },
      },
      {
        id: 'sec-faq-' + (Date.now() + 6),
        type: 'faq',
        title: 'Frequently Asked Questions',
        isVisible: true,
        content: {
          headline: 'Got Questions?',
          subheadline: 'Common inquiries about features, security, and export formats.',
          items: [
            {
              title: 'Can I export clean source files?',
              description: 'Yes. You can download single HTML/CSS files or full production ZIP bundles anytime.',
            },
            {
              title: 'How does code repair work?',
              description: 'Our repair studio detects missing viewports, invalid links, and unlabelled forms with 1-click fixes.',
            },
          ],
        },
      },
      {
        id: 'sec-contact-' + (Date.now() + 7),
        type: 'contact',
        title: 'Contact & Reservations',
        isVisible: true,
        content: {
          headline: 'Get in Touch',
          subheadline: 'Send us a message and our team will get back to you within 24 hours.',
          buttonText: 'Send Inquiry',
        },
      },
      {
        id: 'sec-footer-' + (Date.now() + 8),
        type: 'footer',
        title: 'Footer',
        isVisible: true,
        content: {
          headline: name,
          subheadline: 'Build Smarter. Repair Faster. Powered by SiteGen AI.',
          copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
        },
      }
    );

    return englishSections;
  }
}
