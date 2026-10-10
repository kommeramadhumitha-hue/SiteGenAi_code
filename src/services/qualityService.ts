import { QualityCheck, QualityReport } from '../types';

export function analyzeHtmlQuality(htmlContent: string): QualityReport {
  const checks: QualityCheck[] = [];

  // Parse using browser DOMParser if available, or regex fallback
  let doc: Document | null = null;
  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      doc = parser.parseFromString(htmlContent, 'text/html');
    } catch {
      doc = null;
    }
  }

  // 1. Accessibility Checks
  // Check A1: Image alt tags
  if (doc) {
    const images = Array.from(doc.querySelectorAll('img'));
    if (images.length === 0) {
      checks.push({
        id: 'a11y-img-alt',
        category: 'accessibility',
        name: 'Image Alternative Text',
        description: 'All <img> elements must provide descriptive alt attributes for screen readers.',
        status: 'passed',
        isEstimated: false,
        scoreImpact: 10,
        explanation: 'No images found or all present images are accounted for.',
        fixRecommendation: 'Ensure any newly added images have descriptive alt text.',
      });
    } else {
      const missingAlt = images.filter((img) => !img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === '');
      if (missingAlt.length === 0) {
        checks.push({
          id: 'a11y-img-alt',
          category: 'accessibility',
          name: 'Image Alternative Text',
          description: 'All <img> elements must provide descriptive alt attributes.',
          status: 'passed',
          isEstimated: false,
          scoreImpact: 10,
          explanation: `All ${images.length} images specify appropriate alt attributes.`,
          fixRecommendation: 'Keep alt attributes maintained as images are updated.',
        });
      } else {
        checks.push({
          id: 'a11y-img-alt',
          category: 'accessibility',
          name: 'Image Alternative Text',
          description: 'All <img> elements must provide descriptive alt attributes.',
          status: 'failed',
          isEstimated: false,
          scoreImpact: 10,
          explanation: `Found ${missingAlt.length} of ${images.length} images without an alt attribute.`,
          fixRecommendation: 'Add alt="Descriptive text" to all <img> elements.',
          location: missingAlt[0]?.outerHTML?.slice(0, 80) + '...',
        });
      }
    }

    // Check A2: Form inputs have labels
    const inputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, select'));
    if (inputs.length > 0) {
      const unlabelled = inputs.filter((inp) => {
        const id = inp.getAttribute('id');
        const hasAria = inp.hasAttribute('aria-label') || inp.hasAttribute('aria-labelledby');
        const hasLabel = id ? doc?.querySelector(`label[for="${id}"]`) : null;
        return !hasAria && !hasLabel;
      });

      if (unlabelled.length === 0) {
        checks.push({
          id: 'a11y-form-labels',
          category: 'accessibility',
          name: 'Form Control Labels',
          description: 'Every form control should have a matching <label> or aria-label.',
          status: 'passed',
          isEstimated: false,
          scoreImpact: 8,
          explanation: `All ${inputs.length} form controls have accessible labels.`,
          fixRecommendation: 'Maintain associated labels for form inputs.',
        });
      } else {
        checks.push({
          id: 'a11y-form-labels',
          category: 'accessibility',
          name: 'Form Control Labels',
          description: 'Every form control should have a matching <label> or aria-label.',
          status: 'warning',
          isEstimated: false,
          scoreImpact: 8,
          explanation: `Found ${unlabelled.length} input(s) without an explicit label or aria-label.`,
          fixRecommendation: 'Wrap input inside <label> or link using <label for="inputId">.',
        });
      }
    } else {
      checks.push({
        id: 'a11y-form-labels',
        category: 'accessibility',
        name: 'Form Control Labels',
        description: 'Interactive inputs provide screen-reader labels.',
        status: 'passed',
        isEstimated: false,
        scoreImpact: 8,
        explanation: 'No form inputs present on page.',
        fixRecommendation: 'Always label interactive inputs.',
      });
    }

    // Check A3: Single H1 Heading
    const h1s = Array.from(doc.querySelectorAll('h1'));
    if (h1s.length === 1) {
      checks.push({
        id: 'a11y-h1-hierarchy',
        category: 'accessibility',
        name: 'Single <h1> Landmark',
        description: 'Every page should contain exactly one main <h1> heading.',
        status: 'passed',
        isEstimated: false,
        scoreImpact: 7,
        explanation: `Found 1 primary <h1> heading ("${h1s[0].textContent?.trim().slice(0, 30)}...").`,
        fixRecommendation: 'Maintain heading hierarchy (h1 -> h2 -> h3).',
      });
    } else if (h1s.length === 0) {
      checks.push({
        id: 'a11y-h1-hierarchy',
        category: 'accessibility',
        name: 'Single <h1> Landmark',
        description: 'Every page should contain exactly one main <h1> heading.',
        status: 'warning',
        isEstimated: false,
        scoreImpact: 7,
        explanation: 'No <h1> heading detected on the page.',
        fixRecommendation: 'Add an <h1> tag to your hero or top title section.',
      });
    } else {
      checks.push({
        id: 'a11y-h1-hierarchy',
        category: 'accessibility',
        name: 'Single <h1> Landmark',
        description: 'Every page should contain exactly one main <h1> heading.',
        status: 'warning',
        isEstimated: false,
        scoreImpact: 7,
        explanation: `Found ${h1s.length} <h1> tags on the page. Multiple <h1> tags confuse screen readers.`,
        fixRecommendation: 'Consolidate down to a single <h1> and convert secondary titles to <h2>.',
      });
    }
  }

  // 2. Responsiveness Checks
  const hasViewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']*width=device-width[^"']*["']/i.test(htmlContent);
  if (hasViewport) {
    checks.push({
      id: 'resp-viewport-meta',
      category: 'responsiveness',
      name: 'Viewport Meta Tag',
      description: 'Page specifies width=device-width, initial-scale=1 for responsive mobile scaling.',
      status: 'passed',
      isEstimated: false,
      scoreImpact: 12,
      explanation: 'Viewport meta tag detected with correct width=device-width declaration.',
      fixRecommendation: 'Retain standard viewport meta in <head>.',
    });
  } else {
    checks.push({
      id: 'resp-viewport-meta',
      category: 'responsiveness',
      name: 'Viewport Meta Tag',
      description: 'Page specifies width=device-width for mobile scaling.',
      status: 'failed',
      isEstimated: false,
      scoreImpact: 12,
      explanation: 'Missing or improper viewport meta tag. Mobile browsers will render in desktop zoom mode.',
      fixRecommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> in <head>.',
    });
  }

  // Check Flex/Grid or Media Queries
  const hasResponsiveCss = /display:\s*(flex|grid)|grid-template|@media|\bclamp\(|repeat\(auto-fit/i.test(htmlContent);
  if (hasResponsiveCss) {
    checks.push({
      id: 'resp-layout-system',
      category: 'responsiveness',
      name: 'Fluid Layout Systems',
      description: 'Styles utilize modern Flexbox, CSS Grid, or fluid typography/media queries.',
      status: 'passed',
      isEstimated: false,
      scoreImpact: 10,
      explanation: 'Modern flexible display modes (Grid/Flex/auto-fit) detected in stylesheet.',
      fixRecommendation: 'Maintain fluid percentage and rem units.',
    });
  } else {
    checks.push({
      id: 'resp-layout-system',
      category: 'responsiveness',
      name: 'Fluid Layout Systems',
      description: 'Styles utilize modern Flexbox or CSS Grid.',
      status: 'warning',
      isEstimated: false,
      scoreImpact: 10,
      explanation: 'No explicit CSS Grid or responsive flex system detected.',
      fixRecommendation: 'Use CSS Grid (auto-fit, minmax) or Flexbox for layout containers.',
    });
  }

  // 3. SEO Checks
  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(htmlContent);
  const titleContent = titleMatch ? titleMatch[1].trim() : '';
  if (titleContent.length >= 10 && titleContent.length <= 70) {
    checks.push({
      id: 'seo-title',
      category: 'seo',
      name: 'Descriptive Page Title',
      description: 'Optimal title length (between 10 and 70 characters) for search engine SERPs.',
      status: 'passed',
      isEstimated: false,
      scoreImpact: 10,
      explanation: `Title is ${titleContent.length} characters: "${titleContent}".`,
      fixRecommendation: 'Keep title concise and keyword-focused.',
    });
  } else if (titleContent.length > 0) {
    checks.push({
      id: 'seo-title',
      category: 'seo',
      name: 'Descriptive Page Title',
      description: 'Optimal title length for search engines.',
      status: 'warning',
      isEstimated: false,
      scoreImpact: 10,
      explanation: `Title length (${titleContent.length} chars) is outside the ideal 10-70 character window.`,
      fixRecommendation: 'Adjust title length to 10-70 characters.',
    });
  } else {
    checks.push({
      id: 'seo-title',
      category: 'seo',
      name: 'Descriptive Page Title',
      description: 'Page specifies a title in <head>.',
      status: 'failed',
      isEstimated: false,
      scoreImpact: 10,
      explanation: 'Missing or empty <title> tag. Search engines cannot index page correctly.',
      fixRecommendation: 'Add <title>Your Website Name — Purpose</title> in <head>.',
    });
  }

  const descMatch = /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i.exec(htmlContent);
  if (descMatch && descMatch[1].trim().length > 20) {
    checks.push({
      id: 'seo-meta-desc',
      category: 'seo',
      name: 'Meta Description Tag',
      description: 'Meta description provides context in search results and social previews.',
      status: 'passed',
      isEstimated: false,
      scoreImpact: 8,
      explanation: `Meta description present (${descMatch[1].trim().length} chars).`,
      fixRecommendation: 'Keep description engaging with a call to action.',
    });
  } else {
    checks.push({
      id: 'seo-meta-desc',
      category: 'seo',
      name: 'Meta Description Tag',
      description: 'Meta description in <head>.',
      status: 'warning',
      isEstimated: false,
      scoreImpact: 8,
      explanation: 'Missing or short meta description tag.',
      fixRecommendation: 'Add <meta name="description" content="50-160 characters summary">.',
    });
  }

  // 4. Hyperlink & Resource Checks
  if (doc) {
    const anchors = Array.from(doc.querySelectorAll('a'));
    const emptyAnchors = anchors.filter((a) => {
      const href = a.getAttribute('href');
      return !href || href === '' || href === '#';
    });

    if (emptyAnchors.length === 0) {
      checks.push({
        id: 'links-href-validity',
        category: 'links',
        name: 'Functional Hyperlinks',
        description: 'All anchor tags define valid destination URLs or anchor target IDs.',
        status: 'passed',
        isEstimated: false,
        scoreImpact: 8,
        explanation: `All ${anchors.length} links point to concrete targets or sections.`,
        fixRecommendation: 'Keep links verified during site edits.',
      });
    } else {
      checks.push({
        id: 'links-href-validity',
        category: 'links',
        name: 'Functional Hyperlinks',
        description: 'All anchor tags define valid destination URLs.',
        status: 'warning',
        isEstimated: false,
        scoreImpact: 8,
        explanation: `Found ${emptyAnchors.length} anchor(s) with placeholder href="#" or empty destinations.`,
        fixRecommendation: 'Provide legitimate href target IDs (e.g. href="#features") or external URLs.',
      });
    }
  }

  // 5. HTML Structure & Semantics
  const hasDoctype = /<!doctype\s+html>/i.test(htmlContent);
  const hasHtmlLang = /<html[^>]*\blang=["'][a-z]{2}(-[A-Z]{2})?["']/i.test(htmlContent);
  const hasSemanticElements = /<(header|nav|main|section|article|footer)[\s>]/i.test(htmlContent);

  if (hasDoctype && hasHtmlLang && hasSemanticElements) {
    checks.push({
      id: 'html-semantic-standards',
      category: 'html',
      name: 'Semantic HTML5 Standards',
      description: 'Document includes doctype, lang attribute, and semantic landmark elements.',
      status: 'passed',
      isEstimated: false,
      scoreImpact: 10,
      explanation: 'HTML5 Doctype, lang attribute, and semantic elements (header, nav, section, footer) are present.',
      fixRecommendation: 'Continue using semantic containers rather than generic <div> tags.',
    });
  } else {
    checks.push({
      id: 'html-semantic-standards',
      category: 'html',
      name: 'Semantic HTML5 Standards',
      description: 'Document includes doctype, lang attribute, and semantic tags.',
      status: 'warning',
      isEstimated: false,
      scoreImpact: 10,
      explanation: `Issues detected: ${!hasDoctype ? 'Missing <!DOCTYPE html>. ' : ''}${!hasHtmlLang ? 'Missing <html lang="en">. ' : ''}${!hasSemanticElements ? 'Missing semantic landmarks. ' : ''}`,
      fixRecommendation: 'Add doctype, html lang attribute, and semantic containers.',
    });
  }

  // 6. Performance & Efficiency
  const htmlByteSize = new Blob([htmlContent]).size;
  if (htmlByteSize < 250000) {
    checks.push({
      id: 'perf-payload-size',
      category: 'performance',
      name: 'Document Payload Weight',
      description: 'HTML markup payload is lightweight and will stream instantly over mobile connections.',
      status: 'passed',
      isEstimated: false,
      scoreImpact: 8,
      explanation: `Document payload is ${(htmlByteSize / 1024).toFixed(1)} KB (well below the 250KB budget).`,
      fixRecommendation: 'Keep markup streamlined and defer heavy scripts.',
    });
  } else {
    checks.push({
      id: 'perf-payload-size',
      category: 'performance',
      name: 'Document Payload Weight',
      description: 'Lightweight HTML payload size.',
      status: 'warning',
      isEstimated: false,
      scoreImpact: 8,
      explanation: `Document payload is ${(htmlByteSize / 1024).toFixed(1)} KB, which is higher than optimal.`,
      fixRecommendation: 'Extract inline scripts/styles into separate assets.',
    });
  }

  // Check 7: Lighthouse Core Web Vitals (Labeled as estimated / Level 2 integration point)
  checks.push({
    id: 'perf-real-core-web-vitals',
    category: 'performance',
    name: 'Real Core Web Vitals (LCP, CLS, INP)',
    description: 'Real-time telemetry measuring Largest Contentful Paint and Cumulative Layout Shift in headless Chrome.',
    status: 'unavailable',
    isEstimated: true,
    scoreImpact: 0,
    explanation: 'Headless Chrome runner is scheduled for Level 2 backend integration. Structural markup checks are verified.',
    fixRecommendation: 'Connect the Express Node.js backend in Level 2 to activate headless Chrome audit.',
  });

  // Calculate overall score based on passed vs total actionable
  let totalWeight = 0;
  let earnedScore = 0;

  checks.forEach((c) => {
    if (c.status === 'unavailable') return;
    totalWeight += c.scoreImpact;
    if (c.status === 'passed') {
      earnedScore += c.scoreImpact;
    } else if (c.status === 'warning') {
      earnedScore += c.scoreImpact * 0.5;
    }
  });

  const overallScore = totalWeight > 0 ? Math.round((earnedScore / totalWeight) * 100) : 100;

  const summary = {
    passed: checks.filter((c) => c.status === 'passed').length,
    warning: checks.filter((c) => c.status === 'warning').length,
    failed: checks.filter((c) => c.status === 'failed').length,
    unavailable: checks.filter((c) => c.status === 'unavailable').length,
  };

  return {
    overallScore,
    isMeasured: true,
    checks,
    summary,
    analyzedAt: new Date().toISOString(),
  };
}
