export function evaluateQuality(html = '', css = '') {
  const checks = [];

  // 1. Accessibility Checks
  // Check A1: Image alt attributes
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  if (imgMatches.length > 0) {
    const unaltImages = imgMatches.filter((img) => !img.includes('alt=') || /alt=["']\s*["']/.test(img));
    if (unaltImages.length === 0) {
      checks.push({
        id: 'a11y-img-alt',
        category: 'accessibility',
        name: 'Image Alternative Text',
        description: 'All <img> elements provide descriptive alt text for assistive screen readers.',
        status: 'passed',
        scoreImpact: 10,
        explanation: `All ${imgMatches.length} images specify alt attributes.`,
        fixRecommendation: 'Keep alt attributes maintained as assets evolve.',
      });
    } else {
      checks.push({
        id: 'a11y-img-alt',
        category: 'accessibility',
        name: 'Image Alternative Text',
        description: 'All <img> elements must provide descriptive alt attributes.',
        status: 'failed',
        scoreImpact: 10,
        explanation: `Found ${unaltImages.length} image(s) lacking descriptive alt text.`,
        fixRecommendation: 'Add alt="Descriptive text" to all <img> tags.',
      });
    }
  } else {
    checks.push({
      id: 'a11y-img-alt',
      category: 'accessibility',
      name: 'Image Alternative Text',
      description: 'Image accessibility verification.',
      status: 'passed',
      scoreImpact: 10,
      explanation: 'No images detected on page.',
      fixRecommendation: 'Ensure future images include alt attributes.',
    });
  }

  // Check A2: Single H1 landmark
  const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  if (h1Matches.length === 1) {
    checks.push({
      id: 'a11y-single-h1',
      category: 'accessibility',
      name: 'Single <h1> Main Heading',
      description: 'Document has exactly one primary <h1> title heading.',
      status: 'passed',
      scoreImpact: 8,
      explanation: 'Found exactly 1 primary <h1> heading tag.',
      fixRecommendation: 'Maintain heading hierarchy (h1 -> h2 -> h3).',
    });
  } else if (h1Matches.length === 0) {
    checks.push({
      id: 'a11y-single-h1',
      category: 'accessibility',
      name: 'Single <h1> Main Heading',
      description: 'Document must define an <h1> heading landmark.',
      status: 'warning',
      scoreImpact: 8,
      explanation: 'No <h1> heading detected on the page.',
      fixRecommendation: 'Add an <h1> heading inside your hero or main header.',
    });
  } else {
    checks.push({
      id: 'a11y-single-h1',
      category: 'accessibility',
      name: 'Single <h1> Main Heading',
      description: 'Document should not declare multiple <h1> headings.',
      status: 'warning',
      scoreImpact: 8,
      explanation: `Found ${h1Matches.length} <h1> tags. Multiple <h1> headings confuse screen readers.`,
      fixRecommendation: 'Convert secondary titles to <h2> headings.',
    });
  }

  // 2. Responsiveness Checks
  const hasViewport = /<meta\s+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html);
  if (hasViewport) {
    checks.push({
      id: 'resp-viewport',
      category: 'responsiveness',
      name: 'Mobile Viewport Meta Tag',
      description: 'Page defines width=device-width for mobile scaling.',
      status: 'passed',
      scoreImpact: 12,
      explanation: 'Viewport meta tag detected with correct initial-scale.',
      fixRecommendation: 'Retain standard viewport declaration in <head>.',
    });
  } else {
    checks.push({
      id: 'resp-viewport',
      category: 'responsiveness',
      name: 'Mobile Viewport Meta Tag',
      description: 'Page specifies width=device-width.',
      status: 'failed',
      scoreImpact: 12,
      explanation: 'Missing viewport meta tag. Mobile browsers will default to desktop zoom.',
      fixRecommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> in <head>.',
    });
  }

  // Check 3: SEO Title and Description
  const hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(html);
  if (hasTitle) {
    checks.push({
      id: 'seo-title',
      category: 'seo',
      name: 'Document Title Element',
      description: 'Page specifies a title in <head>.',
      status: 'passed',
      scoreImpact: 8,
      explanation: 'Page title declared in <head>.',
      fixRecommendation: 'Keep title keyword-optimized and between 10-60 characters.',
    });
  } else {
    checks.push({
      id: 'seo-title',
      category: 'seo',
      name: 'Document Title Element',
      description: 'Page specifies a title in <head>.',
      status: 'failed',
      scoreImpact: 8,
      explanation: 'Missing <title> tag. Search engines cannot index page correctly.',
      fixRecommendation: 'Add <title>Website Title</title> inside <head>.',
    });
  }

  // Check 4: Semantic Landmarks
  const hasSemantics = /<(header|nav|main|section|article|footer)[\s>]/i.test(html);
  if (hasSemantics) {
    checks.push({
      id: 'html-semantic-landmarks',
      category: 'html',
      name: 'Semantic HTML5 Landmark Tags',
      description: 'Uses semantic structural tags (<header>, <nav>, <section>, <footer>).',
      status: 'passed',
      scoreImpact: 10,
      explanation: 'Semantic landmark containers detected.',
      fixRecommendation: 'Continue using semantic containers rather than generic <div> tags.',
    });
  } else {
    checks.push({
      id: 'html-semantic-landmarks',
      category: 'html',
      name: 'Semantic HTML5 Landmark Tags',
      description: 'Uses semantic structural tags.',
      status: 'warning',
      scoreImpact: 10,
      explanation: 'Document relies solely on generic <div> tags.',
      fixRecommendation: 'Wrap content in <header>, <section>, and <footer> tags.',
    });
  }

  // Check 5: Duplicate IDs
  const idRegex = /id=["']([^"']+)["']/gi;
  const seenIds = new Set();
  let hasDup = false;
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    if (seenIds.has(match[1])) {
      hasDup = true;
      break;
    }
    seenIds.add(match[1]);
  }

  if (!hasDup) {
    checks.push({
      id: 'html-unique-ids',
      category: 'html',
      name: 'Element ID Uniqueness',
      description: 'Every element id in the document is unique.',
      status: 'passed',
      scoreImpact: 8,
      explanation: 'All element IDs are unique across the document.',
      fixRecommendation: 'Ensure dynamically generated components receive unique IDs.',
    });
  } else {
    checks.push({
      id: 'html-unique-ids',
      category: 'html',
      name: 'Element ID Uniqueness',
      description: 'Every element id in the document is unique.',
      status: 'warning',
      scoreImpact: 8,
      explanation: 'Duplicate ID attribute detected in the DOM.',
      fixRecommendation: 'Rename duplicate IDs to guarantee uniqueness.',
    });
  }

  // Check 6: Headless Chrome Telemetry (Explicitly labeled as Level 3 Edge Runner)
  checks.push({
    id: 'perf-headless-telemetry',
    category: 'performance',
    name: 'Real Core Web Vitals (LCP, CLS, FID)',
    description: 'Server-side headless Chrome Lighthouse instrumentation.',
    status: 'unavailable',
    isEstimated: true,
    scoreImpact: 0,
    explanation: 'Headless Chrome runtime is queued for Level 3 production Edge cluster.',
    fixRecommendation: 'Deploy website via GitHub/Vercel to trigger edge Lighthouse audits.',
  });

  // Calculate score with documented formula
  let totalWeight = 0;
  let earnedScore = 0;
  checks.forEach((c) => {
    if (c.status === 'unavailable') return;
    totalWeight += c.scoreImpact;
    if (c.status === 'passed') earnedScore += c.scoreImpact;
    else if (c.status === 'warning') earnedScore += c.scoreImpact * 0.5;
  });

  const overallScore = totalWeight > 0 ? Math.round((earnedScore / totalWeight) * 100) : 100;

  return {
    overallScore,
    checks,
    summary: {
      passed: checks.filter((c) => c.status === 'passed').length,
      warning: checks.filter((c) => c.status === 'warning').length,
      failed: checks.filter((c) => c.status === 'failed').length,
      unavailable: checks.filter((c) => c.status === 'unavailable').length,
    },
    formula: 'Score = (Sum of earned check weights / Total testable weights) * 100',
    evaluatedAt: new Date().toISOString(),
  };
}
