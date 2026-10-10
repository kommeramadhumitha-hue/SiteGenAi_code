/**
 * Server-side Repair Diagnostic Engine
 * Analyzes HTML & CSS for deterministic structural flaws, accessibility violations,
 * responsive hazards, and generates verified patches.
 */
export function analyzeAndDiagnoseCode(html = '', css = '') {
  const issues = [];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB safe limit

  if (html.length > MAX_FILE_SIZE || css.length > MAX_FILE_SIZE) {
    throw new Error('File exceeds maximum safety size limit of 5MB.');
  }

  // 1. Missing DOCTYPE
  if (!/<!doctype\s+html>/i.test(html)) {
    issues.push({
      id: 'fix-doctype',
      category: 'html_syntax',
      severity: 'medium',
      title: 'Missing HTML5 Doctype Declaration',
      description: 'Browsers may enter Quirks Mode without a standards-compliant <!DOCTYPE html> declaration.',
      location: 'Document Root (Line 1)',
      originalSnippet: html.slice(0, 35) + '...',
      fixedSnippet: '<!DOCTYPE html>\n<html lang="en">\n' + html.slice(0, 35) + '...',
      isDeterministic: true,
      applied: false,
    });
  }

  // 2. Missing Viewport Meta Tag (Critical Responsiveness)
  if (!/<meta\s+name=["']viewport["']/i.test(html)) {
    const headIndex = html.indexOf('<head>');
    issues.push({
      id: 'fix-viewport',
      category: 'responsiveness',
      severity: 'critical',
      title: 'Missing Mobile Viewport Meta Tag',
      description: 'Mobile browsers will render this webpage at desktop zoom scale (980px) instead of fluid device-width.',
      location: headIndex !== -1 ? '<head> Tag' : 'Root Header',
      originalSnippet: '<head>',
      fixedSnippet: '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      isDeterministic: true,
      applied: false,
    });
  }

  // 3. Images Missing Alt Attributes (Accessibility)
  const imgRegex = /<img(?![^>]*\balt=)[^>]*>/gi;
  let imgMatch;
  let imgCount = 0;
  while ((imgMatch = imgRegex.exec(html)) !== null && imgCount < 5) {
    imgCount++;
    const original = imgMatch[0];
    const fixed = original.replace('<img', '<img alt="Descriptive visual illustration"');
    issues.push({
      id: `fix-img-alt-${imgCount}`,
      category: 'accessibility',
      severity: 'high',
      title: `Missing Alt Attribute on <img> (#${imgCount})`,
      description: 'Screen reader users will hear unhelpful raw filenames instead of content context.',
      location: `Image Element #${imgCount}`,
      originalSnippet: original,
      fixedSnippet: fixed,
      isDeterministic: true,
      applied: false,
    });
  }

  // 4. Form Inputs Missing Associated Label or ID
  const unlabelledInputRegex = /<input(?![^>]*\b(id|aria-label)=)[^>]*>/gi;
  let inputMatch;
  let inputCount = 0;
  while ((inputMatch = unlabelledInputRegex.exec(html)) !== null && inputCount < 4) {
    inputCount++;
    const original = inputMatch[0];
    const fixed = `<label class="form-label">Input Field\n  ${original.replace('<input', `<input id="field-${inputCount}" aria-label="Input Field"`)}\n</label>`;
    issues.push({
      id: `fix-unlabelled-input-${inputCount}`,
      category: 'accessibility',
      severity: 'high',
      title: `Unlabelled Form Input Element (#${inputCount})`,
      description: 'Assistive technologies cannot announce the purpose of this input to users.',
      location: `Form Control #${inputCount}`,
      originalSnippet: original,
      fixedSnippet: fixed,
      isDeterministic: true,
      applied: false,
    });
  }

  // 5. Insecure target="_blank"
  const unsafeLinkRegex = /<a\s+[^>]*target=["']_blank["'](?![^>]*\brel=)[^>]*>/gi;
  let unsafeMatch;
  let unsafeCount = 0;
  while ((unsafeMatch = unsafeLinkRegex.exec(html)) !== null && unsafeCount < 3) {
    unsafeCount++;
    const original = unsafeMatch[0];
    const fixed = original.replace('<a ', '<a rel="noopener noreferrer" ');
    issues.push({
      id: `fix-unsafe-link-${unsafeCount}`,
      category: 'broken_links',
      severity: 'medium',
      title: `Target _blank Without rel="noopener noreferrer" (#${unsafeCount})`,
      description: 'Opening new tabs without noopener risks reverse-tabnabbing security exploits.',
      location: `Anchor Tag #${unsafeCount}`,
      originalSnippet: original,
      fixedSnippet: fixed,
      isDeterministic: true,
      applied: false,
    });
  }

  // 6. Non-Fluid Rigid Fixed Pixel Widths in CSS
  const fixedWidthRegex = /width\s*:\s*(9[0-9]{2}|1[0-9]{3})px\s*;/gi;
  let widthMatch;
  if ((widthMatch = fixedWidthRegex.exec(css || html)) !== null) {
    const original = widthMatch[0];
    const fixed = `max-width: 100%; width: ${widthMatch[1]}px; box-sizing: border-box;`;
    issues.push({
      id: 'fix-fixed-width',
      category: 'responsiveness',
      severity: 'critical',
      title: 'Fixed Pixel Container Causes Mobile Horizontal Overflow',
      description: `Container has hardcoded ${original}, generating horizontal scrollbars on phones.`,
      location: 'CSS Styling Rules',
      originalSnippet: original,
      fixedSnippet: fixed,
      isDeterministic: true,
      applied: false,
    });
  }

  // 7. Duplicate IDs Check
  const idRegex = /id=["']([^"']+)["']/gi;
  const seenIds = new Set();
  const duplicateIds = new Set();
  let idMatch;
  while ((idMatch = idRegex.exec(html)) !== null) {
    const val = idMatch[1];
    if (seenIds.has(val)) {
      duplicateIds.add(val);
    }
    seenIds.add(val);
  }

  duplicateIds.forEach((dupId) => {
    issues.push({
      id: `fix-duplicate-id-${dupId}`,
      category: 'html_syntax',
      severity: 'high',
      title: `Duplicate HTML ID Attribute ("${dupId}")`,
      description: `The ID "${dupId}" appears multiple times in the document, violating HTML5 uniqueness standards.`,
      location: `Element ID="${dupId}"`,
      originalSnippet: `id="${dupId}"`,
      fixedSnippet: `id="${dupId}-unique"`,
      isDeterministic: true,
      applied: false,
    });
  });

  return {
    issues,
    summary: {
      critical: issues.filter((i) => i.severity === 'critical').length,
      high: issues.filter((i) => i.severity === 'high').length,
      medium: issues.filter((i) => i.severity === 'medium').length,
      low: issues.filter((i) => i.severity === 'low').length,
      total: issues.length,
    },
    analyzedAt: new Date().toISOString(),
  };
}

export function applySingleFixToCode(html, css, issue) {
  let newHtml = html;
  let newCss = css;

  if (issue.category === 'responsiveness' && issue.id === 'fix-fixed-width') {
    if (newCss.includes(issue.originalSnippet)) {
      newCss = newCss.replace(issue.originalSnippet, issue.fixedSnippet);
    } else if (newHtml.includes(issue.originalSnippet)) {
      newHtml = newHtml.replace(issue.originalSnippet, issue.fixedSnippet);
    }
  } else {
    if (newHtml.includes(issue.originalSnippet)) {
      newHtml = newHtml.replace(issue.originalSnippet, issue.fixedSnippet);
    } else if (issue.id === 'fix-doctype' && !/<!doctype\s+html>/i.test(newHtml)) {
      newHtml = `<!DOCTYPE html>\n<html lang="en">\n${newHtml}`;
    } else if (issue.id === 'fix-viewport' && !/<meta\s+name=["']viewport/i.test(newHtml)) {
      newHtml = newHtml.replace(/<head>/i, `<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    }
  }

  return { html: newHtml, css: newCss };
}
