export class RepairAgent {
  constructor() {
    this.role = 'Autonomous Repair Agent';
  }

  repair(project, validationIssues = []) {
    const repaired = JSON.parse(JSON.stringify(project));
    const repairsApplied = [];

    // Ensure valid palette
    if (!repaired.palette || !repaired.palette.primary) {
      repaired.palette = {
        id: 'cyber-violet',
        name: 'Cyber Violet & Blue',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        background: '#070a13',
        surface: '#0f172a',
        text: '#f8fafc',
      };
      repairsApplied.push('Injected standardized high-contrast color palette');
    }

    // Ensure navbar exists
    const hasNav = repaired.sections.some((s) => s.type === 'navbar');
    if (!hasNav) {
      repaired.sections.unshift({
        id: 'sec-nav-repaired',
        type: 'navbar',
        title: 'Header Navigation',
        isVisible: true,
        content: {
          headline: repaired.name || 'Platform Hub',
          links: [
            { label: 'Features', url: '#features' },
            { label: 'About', url: '#about' },
            { label: 'Contact', url: '#contact' },
          ],
          primaryCtaText: 'Get Started',
          primaryCtaUrl: '#contact',
        },
      });
      repairsApplied.push('Added missing accessible navbar landmark');
    }

    // Ensure footer exists
    const hasFooter = repaired.sections.some((s) => s.type === 'footer');
    if (!hasFooter) {
      repaired.sections.push({
        id: 'sec-footer-repaired',
        type: 'footer',
        title: 'Footer',
        isVisible: true,
        content: {
          headline: repaired.name,
          subheadline: 'Crafted with SiteGen AI • Build Smarter. Repair Faster.',
          copyright: `© ${new Date().getFullYear()} ${repaired.name}. All rights reserved.`,
        },
      });
      repairsApplied.push('Added missing semantic footer landmark');
    }

    // Ensure each section has valid content and boolean isVisible
    repaired.sections = repaired.sections.map((sec, idx) => ({
      ...sec,
      id: sec.id || `sec-${sec.type}-${idx + 1}`,
      title: sec.title || `${sec.type} Section`,
      isVisible: typeof sec.isVisible === 'boolean' ? sec.isVisible : true,
      content: sec.content || { headline: 'Section Headline' },
    }));

    return {
      repairedProject: repaired,
      repairsApplied,
    };
  }
}
