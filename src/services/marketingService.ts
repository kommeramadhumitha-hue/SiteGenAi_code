import { WebsiteProject, MarketingStrategy } from '../types';

export interface AuditMarketingResult {
  score: number;
  breakdown: {
    seo: number;
    responsiveness: number;
    callsToAction: number;
    contactDetails: number;
  };
  checks: Array<{
    category: 'seo' | 'responsiveness' | 'callsToAction' | 'contactDetails';
    title: string;
    passed: boolean;
    details: string;
  }>;
}

export function auditProjectMarketing(project: WebsiteProject): AuditMarketingResult {
  const sections = project.sections || [];
  const checks: AuditMarketingResult['checks'] = [];

  // 1. SEO Checks
  const hasH1 = sections.some((s) => s.type === 'hero' && s.content?.headline);
  checks.push({
    category: 'seo',
    title: 'Primary Hero Headline (H1 equivalent)',
    passed: Boolean(hasH1),
    details: hasH1
      ? 'Clear primary value proposition headline detected in Hero section.'
      : 'Hero section headline is missing or empty.',
  });

  const hasSubheadline = sections.some((s) => s.content?.subheadline);
  checks.push({
    category: 'seo',
    title: 'Supporting Context & Meta Copy',
    passed: Boolean(hasSubheadline),
    details: hasSubheadline
      ? 'Subhead text detected providing indexing context for search engines.'
      : 'No descriptive secondary subheadline found.',
  });

  const hasMultiSections = sections.length >= 4;
  checks.push({
    category: 'seo',
    title: 'Content Depth & Semantic Structure',
    passed: hasMultiSections,
    details: hasMultiSections
      ? `${sections.length} semantic sections provide rich topical relevance.`
      : 'Page has fewer than 4 sections, which may limit search visibility.',
  });

  // 2. Responsiveness Checks
  const hasNavbar = sections.some((s) => s.type === 'navbar');
  checks.push({
    category: 'responsiveness',
    title: 'Responsive Navigation Header',
    passed: Boolean(hasNavbar),
    details: hasNavbar
      ? 'Navbar section configured with responsive links.'
      : 'No navbar section found.',
  });

  const hasFluidFooter = sections.some((s) => s.type === 'footer');
  checks.push({
    category: 'responsiveness',
    title: 'Mobile-Friendly Footer',
    passed: Boolean(hasFluidFooter),
    details: hasFluidFooter
      ? 'Footer detected with copyright and navigation anchor points.'
      : 'Footer section is missing.',
  });

  // 3. Calls to Action (CTA) Checks
  const hasHeroCta = sections.some(
    (s) => s.type === 'hero' && s.content?.primaryCtaText
  );
  checks.push({
    category: 'callsToAction',
    title: 'Above-the-Fold Primary Call to Action',
    passed: Boolean(hasHeroCta),
    details: hasHeroCta
      ? 'Hero contains actionable conversion button.'
      : 'Hero section does not have a primary CTA button.',
  });

  const totalCtas = sections.filter(
    (s) => s.content?.primaryCtaText || s.content?.buttonText || s.type === 'cta'
  ).length;
  checks.push({
    category: 'callsToAction',
    title: 'Multi-Point Conversion Flow',
    passed: totalCtas >= 2,
    details: totalCtas >= 2
      ? `Found ${totalCtas} conversion trigger points throughout the page.`
      : 'Add more CTA trigger points to improve user conversion rate.',
  });

  // 4. Contact Details Checks
  const hasContactSection = sections.some(
    (s) => s.type === 'contact' || s.type === 'footer'
  );
  checks.push({
    category: 'contactDetails',
    title: 'Dedicated Contact / Inquiry Channel',
    passed: Boolean(hasContactSection),
    details: hasContactSection
      ? 'Contact or inquiry section present on page.'
      : 'No contact section found for customer inquiries.',
  });

  const hasContactFields = sections.some(
    (s) => s.type === 'contact' && (s.content?.headline || s.content?.buttonText)
  );
  checks.push({
    category: 'contactDetails',
    title: 'Interactive Lead Capture Form',
    passed: Boolean(hasContactFields),
    details: hasContactFields
      ? 'Interactive message/reservation form present.'
      : 'Consider adding form fields or email capture.',
  });

  // Calculate scores
  const getCatScore = (cat: string) => {
    const catChecks = checks.filter((c) => c.category === cat);
    if (!catChecks.length) return 90;
    const passed = catChecks.filter((c) => c.passed).length;
    return Math.round((passed / catChecks.length) * 100);
  };

  const seo = getCatScore('seo');
  const responsiveness = getCatScore('responsiveness');
  const callsToAction = getCatScore('callsToAction');
  const contactDetails = getCatScore('contactDetails');

  const overallScore = Math.round(
    seo * 0.3 + responsiveness * 0.25 + callsToAction * 0.25 + contactDetails * 0.2
  );

  return {
    score: overallScore,
    breakdown: {
      seo,
      responsiveness,
      callsToAction,
      contactDetails,
    },
    checks,
  };
}
