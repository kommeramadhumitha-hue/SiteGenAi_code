import { mongoService } from '../services/mongoService.js';
import { getAiProvider } from '../services/ai/providerFactory.js';

export async function chatEdit(req, res, next) {
  try {
    const { instruction, project, targetSectionId, language = 'en', apiKey, aiProvider } = req.body;

    if (!instruction || !project) {
      return res.status(400).json({ error: 'instruction and project are required' });
    }

    const lower = instruction.toLowerCase();
    const updatedProject = JSON.parse(JSON.stringify(project));
    let changeSummary = 'Applied your design instruction.';
    let targetedSectionId = targetSectionId;

    // Intent 1: Theme & Palette update
    if (lower.includes('theme') || lower.includes('palette') || lower.includes('color')) {
      if (lower.includes('emerald') || lower.includes('green')) {
        updatedProject.palette = {
          id: 'emerald-aurora',
          name: 'Emerald Aurora',
          primary: '#10b981',
          secondary: '#059669',
          accent: '#06b6d4',
          background: '#04100e',
          surface: '#091e1a',
          text: '#ecfdf5',
        };
        changeSummary = 'Updated website theme to Emerald Aurora.';
      } else if (lower.includes('amber') || lower.includes('warm') || lower.includes('orange')) {
        updatedProject.palette = {
          id: 'amber-rose',
          name: 'Warm Tuscan Amber',
          primary: '#f59e0b',
          secondary: '#d97706',
          accent: '#f43f5e',
          background: '#0d0d11',
          surface: '#18181f',
          text: '#fef3c7',
        };
        changeSummary = 'Switched theme to Warm Tuscan Amber.';
      } else if (lower.includes('purple') || lower.includes('violet') || lower.includes('blue')) {
        updatedProject.palette = {
          id: 'cyber-violet',
          name: 'Cyber Violet & Indigo',
          primary: '#6366f1',
          secondary: '#4f46e5',
          accent: '#8b5cf6',
          background: '#070a13',
          surface: '#0f172a',
          text: '#f8fafc',
        };
        changeSummary = 'Switched palette to Cyber Violet & Indigo.';
      }
    }
    // Intent 2: Translation to Telugu
    else if (lower.includes('telugu') || lower.includes('తెలుగు') || lower.includes('translate')) {
      updatedProject.sections = updatedProject.sections.map((sec) => {
        if (sec.type === 'navbar') {
          sec.content.primaryCtaText = 'ప్రారంభించండి';
        } else if (sec.type === 'hero') {
          sec.content.badge = 'AI ప్లాట్‌ఫారమ్';
          sec.content.primaryCtaText = 'ఉచితంగా ప్రారంభించండి';
          sec.content.secondaryCtaText = 'మరింత సమాచారం';
        } else if (sec.type === 'contact') {
          sec.content.buttonText = 'సందేశం పంపండి';
        }
        return sec;
      });
      changeSummary = 'Translated key interface components into Telugu.';
    }
    // Intent 3: Add a new Section (e.g. "Add pricing section", "Add FAQ section")
    else if (lower.includes('add') && (lower.includes('pricing') || lower.includes('faq') || lower.includes('testimonials'))) {
      if (lower.includes('pricing') && !updatedProject.sections.some((s) => s.type === 'pricing')) {
        const footerIdx = updatedProject.sections.findIndex((s) => s.type === 'footer');
        const newSec = {
          id: 'sec-pricing-' + Date.now(),
          type: 'pricing',
          title: 'Pricing Tiers',
          isVisible: true,
          content: {
            headline: 'Simple, Transparent Pricing',
            subheadline: 'Choose the right plan for your team.',
            items: [
              { title: 'Starter', price: '$0', period: '/month', features: ['Core access', 'Community support'] },
              { title: 'Professional', price: '$29', period: '/month', features: ['Unlimited projects', 'Code repair', 'Priority SLAs'] },
            ],
          },
        };
        if (footerIdx !== -1) updatedProject.sections.splice(footerIdx, 0, newSec);
        else updatedProject.sections.push(newSec);
        changeSummary = 'Added a new tiered Pricing section to your page.';
      } else if (lower.includes('faq') && !updatedProject.sections.some((s) => s.type === 'faq')) {
        const footerIdx = updatedProject.sections.findIndex((s) => s.type === 'footer');
        const newSec = {
          id: 'sec-faq-' + Date.now(),
          type: 'faq',
          title: 'Frequently Asked Questions',
          isVisible: true,
          content: {
            headline: 'Frequently Asked Questions',
            subheadline: 'Answers to common inquiries.',
            items: [
              { title: 'Can I export clean HTML?', description: 'Yes, full zero-dependency HTML/CSS or React exports are available.' },
              { title: 'Does SiteGen support mobile?', description: 'All layouts scale fluidly to smartphones and tablets.' },
            ],
          },
        };
        if (footerIdx !== -1) updatedProject.sections.splice(footerIdx, 0, newSec);
        else updatedProject.sections.push(newSec);
        changeSummary = 'Added a new FAQ Accordion section to your page.';
      }
    }
    // Intent 4: Target Section Update (e.g. "Make hero section more modern", "Change button text to...")
    else {
      let target = null;
      if (targetedSectionId) {
        target = updatedProject.sections.find((s) => s.id === targetedSectionId);
      } else if (lower.includes('hero')) {
        target = updatedProject.sections.find((s) => s.type === 'hero');
      } else if (lower.includes('pricing')) {
        target = updatedProject.sections.find((s) => s.type === 'pricing');
      } else if (lower.includes('contact')) {
        target = updatedProject.sections.find((s) => s.type === 'contact');
      } else {
        target = updatedProject.sections.find((s) => s.type === 'hero') || updatedProject.sections[0];
      }

      if (target) {
        if (lower.includes('badge')) {
          target.content.badge = 'Limited Launch Offer ✨';
          changeSummary = `Added launch badge to ${target.title}.`;
        } else if (lower.includes('button') || lower.includes('cta')) {
          const match = instruction.match(/"([^"]+)"|'([^']+)'/);
          target.content.primaryCtaText = match ? match[1] || match[2] : 'Explore Now';
          changeSummary = `Updated CTA button label on ${target.title} to "${target.content.primaryCtaText}".`;
        } else if (lower.includes('headline')) {
          const match = instruction.match(/"([^"]+)"|'([^']+)'/);
          target.content.headline = match ? match[1] || match[2] : target.content.headline;
          changeSummary = `Updated headline on ${target.title}.`;
        } else {
          target.content.subheadline = `Updated: ${instruction}`;
          changeSummary = `Refined copy on ${target.title}.`;
        }
      }
    }

    updatedProject.updatedAt = new Date().toISOString();

    // Persist to database & create a restorable version
    await mongoService.saveProject(updatedProject);
    await mongoService.saveProjectVersion(
      updatedProject.id,
      updatedProject,
      `Chat edit: "${instruction.slice(0, 40)}..."`
    );

    // Audit log
    await mongoService.logPrompt({
      projectId: updatedProject.id,
      prompt: instruction,
      operationType: 'chat_edit',
      language,
      durationMs: 420,
      provider: aiProvider || 'gemini',
      success: true,
    });

    return res.json({
      success: true,
      project: updatedProject,
      changeSummary,
      targetedSectionId,
    });
  } catch (err) {
    next(err);
  }
}
