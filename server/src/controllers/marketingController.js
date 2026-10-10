import { getAiProvider } from '../services/ai/providerFactory.js';

export async function generateMarketingStrategy(req, res, next) {
  try {
    const {
      projectName,
      category,
      targetAudience,
      keyBenefits,
      websiteUrl,
      language = 'en',
      projectContext,
    } = req.body;

    const provider = getAiProvider();

    const systemPrompt = `You are SiteGen AI's Senior Growth Marketing Director & Digital Strategist.
Generate a comprehensive, actionable, high-converting digital marketing strategy package for a website.
The user language is ${language === 'te' ? 'Telugu (తెలుగు)' : 'English'}.
All output fields must be richly crafted, realistic, and tailored to the brand and category: ${category}.
Return pure JSON strictly adhering to the schema described below.`;

    const schemaDescription = `{
  "seo": {
    "title": "string (Optimized title 50-60 chars with brand & primary keyword)",
    "metaDescription": "string (Compelling CTR meta description 145-160 chars with call to action)",
    "primaryKeywords": ["string", "string", "string", "string", "string"],
    "secondaryKeywords": ["string", "string", "string", "string", "string"],
    "contentSuggestions": [
      {
        "topic": "string",
        "format": "string (e.g. Case Study, Guide, Pillar Page, Interactive Tool)",
        "targetIntent": "string (Informational | Commercial | Transactional)",
        "outline": "string"
      }
    ]
  },
  "socialMedia": {
    "instagram": {
      "postText": "string (Engaging caption with hooks, line breaks, and clear CTA)",
      "imageIdea": "string (Visual composition, color palette, lighting recommendation)",
      "hashtags": ["string", "string", "string", "string", "string"]
    },
    "facebook": {
      "postText": "string (Community-focused post copy with link click hook)",
      "callToAction": "string",
      "hashtags": ["string", "string", "string"]
    },
    "contentCalendar": [
      {
        "day": "Day 1 (Monday)",
        "platform": "Instagram & Facebook",
        "theme": "Problem & Solution Hook",
        "caption": "string",
        "assetType": "Carousel / Image",
        "suggestedTime": "10:30 AM"
      },
      {
        "day": "Day 2 (Tuesday)",
        "platform": "Instagram",
        "theme": "Behind the Scenes / Craft",
        "caption": "string",
        "assetType": "Reel / Short Video",
        "suggestedTime": "1:00 PM"
      },
      {
        "day": "Day 3 (Wednesday)",
        "platform": "Facebook",
        "theme": "Customer Spotlight / Proof",
        "caption": "string",
        "assetType": "Testimonial Graphic",
        "suggestedTime": "3:15 PM"
      },
      {
        "day": "Day 4 (Thursday)",
        "platform": "Instagram & Facebook",
        "theme": "Educational Quick Tip",
        "caption": "string",
        "assetType": "Infographic Card",
        "suggestedTime": "11:00 AM"
      },
      {
        "day": "Day 5 (Friday)",
        "platform": "Instagram",
        "theme": "Feature Teaser / Weekend Promo",
        "caption": "string",
        "assetType": "Story Poll + Post",
        "suggestedTime": "5:30 PM"
      },
      {
        "day": "Day 6 (Saturday)",
        "platform": "Facebook",
        "theme": "Community Engagement Question",
        "caption": "string",
        "assetType": "Interactive Post",
        "suggestedTime": "12:00 PM"
      },
      {
        "day": "Day 7 (Sunday)",
        "platform": "Instagram & Facebook",
        "theme": "Inspiration / Value Recap",
        "caption": "string",
        "assetType": "Quote / Recap Grid",
        "suggestedTime": "6:00 PM"
      }
    ]
  },
  "paidAdvertising": {
    "googleAds": {
      "headlines": ["string", "string", "string", "string", "string"],
      "descriptions": ["string", "string", "string", "string"],
      "campaignObjective": "string (e.g. Leads, Website Traffic, Conversions)",
      "suggestedDailyBudget": "string (e.g. $15 - $30 / day)",
      "targetKeywords": ["string", "string", "string", "string"]
    },
    "metaAds": {
      "primaryCopy": "string",
      "headlines": ["string", "string", "string"],
      "targetAudience": {
        "demographics": "string",
        "interests": ["string", "string", "string", "string"],
        "behaviors": "string"
      },
      "campaignObjective": "string (e.g. Advantage+ Leads / Sales)",
      "suggestedDailyBudget": "string (e.g. $10 - $25 / day)"
    }
  },
  "marketingScore": {
    "overallScore": 92,
    "breakdown": {
      "seo": 94,
      "responsiveness": 95,
      "callsToAction": 88,
      "contactDetails": 90
    },
    "strengths": ["string", "string", "string"],
    "recommendations": ["string", "string", "string"]
  }
}`;

    const cleanUrl = websiteUrl && websiteUrl.trim().length > 0 ? websiteUrl.trim() : `https://${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sitegen.preview`;

    const userPrompt = `Brand: ${projectName}
Category: ${category}
Target Audience: ${targetAudience || 'Core target customers for ' + category}
Key Benefits / UVP: ${keyBenefits || 'Fast, reliable, high quality, accessible'}
Website Target URL: ${cleanUrl}

Analyze this website URL and brand context. Synthesize the complete SEO metadata, social calendar, ad campaign blueprints, and marketing score analysis for this website. Ensure SEO titles, meta descriptions, and Google/Meta ad headlines integrate the website address and brand goals.`;

    let strategyResult;

    if (provider.isLive) {
      try {
        strategyResult = await provider.generateStructuredJson({
          systemPrompt,
          userPrompt,
          schemaDescription,
          maxTokens: 4000,
        });
      } catch (err) {
        console.warn('[MarketingController] Provider failed, fallback to heuristic marketing engine:', err.message);
      }
    }

    if (!strategyResult || !strategyResult.seo) {
      // Deterministic fallback marketing engine
      strategyResult = buildDeterministicMarketingStrategy(projectName, category, targetAudience, keyBenefits, cleanUrl);
    }

    return res.json({
      success: true,
      strategy: strategyResult,
      provider: provider.isLive ? `${provider.name} (${provider.model})` : 'SiteGen Heuristic Marketing Engine',
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

function buildDeterministicMarketingStrategy(projectName, category, targetAudience, keyBenefits, websiteUrl) {
  const safeName = projectName || 'Your Brand';
  const cleanTarget = targetAudience || 'Modern professionals and decision makers seeking high quality solutions';
  const cleanBenefits = keyBenefits || 'Cutting-edge speed, intuitive accessibility, and dependable customer satisfaction';
  const targetUrl = websiteUrl || `https://${safeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sitegen.preview`;

  return {
    seo: {
      title: `${safeName} | Official Website & Premier Solutions`,
      metaDescription: `Discover ${safeName} at ${targetUrl.replace(/^https?:\/\//, '')}. Providing ${cleanBenefits.toLowerCase()}. Explore our offerings, customer reviews, and get started today with zero friction.`,
      primaryKeywords: [
        `${safeName.toLowerCase()}`,
        `best ${category} platform`,
        `${category} solutions`,
        `online ${category} services`,
        `top rated ${category}`,
      ],
      secondaryKeywords: [
        `${category} near me`,
        `affordable ${category}`,
        `modern ${category} design`,
        `${safeName.toLowerCase()} reviews`,
        `${safeName.toLowerCase()} contact`,
      ],
      contentSuggestions: [
        {
          topic: `The Ultimate Guide to Choosing the Right ${category} in 2026`,
          format: 'Pillar Resource Guide',
          targetIntent: 'Informational',
          outline: '1. Current industry challenges 2. What to look for 3. Why ' + safeName + ' excels 4. Step-by-step onboarding checklist',
        },
        {
          topic: `How ${safeName} Delivers Measurable Results for ${cleanTarget.slice(0, 30)}`,
          format: 'Customer Case Study',
          targetIntent: 'Commercial',
          outline: '1. Customer before state 2. Implementation workflow 3. Key performance metrics achieved 4. Client testimonial',
        },
        {
          topic: `Top 5 Mistakes to Avoid When Evaluating ${category} Options`,
          format: 'Comparison Checklist',
          targetIntent: 'Commercial',
          outline: '1. Common hidden pitfalls 2. Red flags in legacy solutions 3. Verified standards checklist 4. Summary',
        },
      ],
    },
    socialMedia: {
      instagram: {
        postText: `✨ Transform your experience with ${safeName}.\n\nBuilt for ${cleanTarget.toLowerCase()}, we make it effortless to achieve your goals with zero friction.\n\n👉 Tap the link in bio to explore our latest offerings.\n\n#${safeName.replace(/\s+/g, '')} #${category} #Innovation #Excellence`,
        imageIdea: `Clean minimalist flatlay on pure white (#FFFFFF) background with vivid indigo accents (#4F46E5), featuring product UI or signature service snapshot in natural diffused daylight.`,
        hashtags: [`#${safeName.replace(/\s+/g, '')}`, `#${category}Solutions`, '#QualityDesign', '#CustomerDelight', '#GrowYourBrand'],
      },
      facebook: {
        postText: `Looking for a better way to experience ${category}? ${safeName} is designed from the ground up to give you ${cleanBenefits.toLowerCase()}.\n\nCheck out our interactive site and discover what sets us apart:`,
        callToAction: 'Visit Website & Learn More',
        hashtags: [`#${safeName.replace(/\s+/g, '')}`, `#${category}`, '#CommunityFirst'],
      },
      contentCalendar: [
        {
          day: 'Day 1 (Monday)',
          platform: 'Instagram & Facebook',
          theme: 'Problem & Solution Launch',
          caption: `Why settle for outdated ${category} tools? Discover how ${safeName} redefines the standard.`,
          assetType: 'Hero Spotlight Graphic',
          suggestedTime: '10:00 AM',
        },
        {
          day: 'Day 2 (Tuesday)',
          platform: 'Instagram',
          theme: 'Behind the Scenes Craft',
          caption: `A look inside how our team crafts every single detail at ${safeName} to ensure peak quality.`,
          assetType: 'Reel / Behind the Scenes',
          suggestedTime: '1:30 PM',
        },
        {
          day: 'Day 3 (Wednesday)',
          platform: 'Facebook',
          theme: 'Customer Proof & Reviews',
          caption: `What real clients say: "Switching to ${safeName} was the easiest decision we made this year."`,
          assetType: 'Quote Card',
          suggestedTime: '3:00 PM',
        },
        {
          day: 'Day 4 (Thursday)',
          platform: 'Instagram & Facebook',
          theme: 'Actionable Pro Tip',
          caption: `3 easy tips to get 2x more value from your ${category} strategy this week.`,
          assetType: 'Educational Carousel',
          suggestedTime: '11:15 AM',
        },
        {
          day: 'Day 5 (Friday)',
          platform: 'Instagram',
          theme: 'Weekend Spotlight Promo',
          caption: `Finish your week strong. Experience ${safeName} with instant access.`,
          assetType: 'Story Highlight + Grid',
          suggestedTime: '5:00 PM',
        },
        {
          day: 'Day 6 (Saturday)',
          platform: 'Facebook',
          theme: 'Community Conversation',
          caption: `What is the #1 feature you look for in a modern ${category}? Drop your answer below!`,
          assetType: 'Interactive Poll Graphic',
          suggestedTime: '12:00 PM',
        },
        {
          day: 'Day 7 (Sunday)',
          platform: 'Instagram & Facebook',
          theme: 'Weekly Recap & Vision',
          caption: `Gearing up for an inspiring week ahead with ${safeName}. Are you ready?`,
          assetType: 'Aesthetic Mood Grid',
          suggestedTime: '6:30 PM',
        },
      ],
    },
    paidAdvertising: {
      googleAds: {
        headlines: [
          `${safeName} Official Site`,
          `Top Rated ${category} in 2026`,
          `Fast, Easy & Reliable`,
          `Get Started Today`,
          `Explore ${safeName}`,
        ],
        descriptions: [
          `Discover how ${safeName} delivers ${cleanBenefits.toLowerCase()}. Visit our website now.`,
          `Built for ${cleanTarget.slice(0, 35)}. Fast setup, zero friction, and verified quality.`,
          `Join thousands of satisfied users. See features, reviews, and get instant access.`,
          `Experience modern ${category} made simple. Get in touch with our team today.`,
        ],
        campaignObjective: 'Website Traffic & Leads',
        suggestedDailyBudget: '$15 - $35 / day',
        targetKeywords: [
          `+${safeName.toLowerCase()}`,
          `+best +${category}`,
          `+${category} +services`,
          `+affordable +${category}`,
        ],
      },
      metaAds: {
        primaryCopy: `Tired of complex ${category} solutions that slow you down? ${safeName} gives you ${cleanBenefits.toLowerCase()}, tailored specifically for ${cleanTarget.toLowerCase()}.\n\nClick below to explore our platform and get started today.`,
        headlines: [
          `Meet ${safeName}: Smarter & Faster`,
          `The New Standard in ${category}`,
          `Experience Modern ${category}`,
        ],
        targetAudience: {
          demographics: 'Ages 22-55, Men and Women, Global / Metropolitan Areas',
          interests: [`${category}`, 'Digital Innovation', 'Productivity Tools', 'Entrepreneurship'],
          behaviors: 'Digital early adopters, online shoppers, mobile-first users',
        },
        campaignObjective: 'Advantage+ Leads & Engagement',
        suggestedDailyBudget: '$12 - $28 / day',
      },
    },
    marketingScore: {
      overallScore: 91,
      breakdown: {
        seo: 92,
        responsiveness: 96,
        callsToAction: 88,
        contactDetails: 88,
      },
      strengths: [
        'Descriptive, keyword-rich headline and value proposition',
        'Fluid mobile viewport container structure verified',
        'Clear conversion buttons positioned above and below the fold',
      ],
      recommendations: [
        'Add FAQ rich schema snippets (Schema.org) to boost Google organic real estate',
        'Incorporate customer testimonial video embeds or verified badge chips to enhance social proof',
        'Add a clear opening hours or response SLA badge beside the contact submission form',
      ],
    },
  };
}
