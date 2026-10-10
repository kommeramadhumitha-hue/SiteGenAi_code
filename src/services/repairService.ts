import { RepairIssue } from '../types';

export interface RepairResult {
  issues: RepairIssue[];
  fixedHtml: string;
  fixedCss: string;
  totalFixed: number;
}

export function detectAndGenerateFixes(html: string, css: string): RepairIssue[] {
  const issues: RepairIssue[] = [];

  // Issue 1: Missing DOCTYPE or HTML lang
  if (!/<!doctype\s+html>/i.test(html)) {
    issues.push({
      id: 'fix-doctype',
      category: 'html_syntax',
      severity: 'medium',
      title: 'Missing HTML5 Doctype Declaration',
      description: 'Browsers may enter Quirks Mode without a standards-compliant DOCTYPE.',
      location: 'Line 1 (Document Root)',
      originalSnippet: html.slice(0, 40) + '...',
      fixedSnippet: '<!DOCTYPE html>\n<html lang="en">\n' + html.slice(0, 40) + '...',
      applied: false,
    });
  }

  // Issue 2: Missing Viewport Meta Tag
  if (!/<meta\s+name=["']viewport["']/i.test(html)) {
    const headIndex = html.indexOf('<head>');
    issues.push({
      id: 'fix-viewport',
      category: 'responsiveness',
      severity: 'critical',
      title: 'Missing Mobile Viewport Meta Tag',
      description: 'Mobile devices will render at 980px desktop scale instead of fluid responsive width.',
      location: headIndex !== -1 ? '<head> section' : 'Document Root',
      originalSnippet: '<head>',
      fixedSnippet: '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      applied: false,
    });
  }

  // Issue 3: Missing Image Alt tags
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
      description: 'Screen reader users will hear raw file URLs instead of content descriptions.',
      location: `Image Element #${imgCount}`,
      originalSnippet: original,
      fixedSnippet: fixed,
      applied: false,
    });
  }

  // Issue 4: Empty or Dead Placeholder Links
  const deadLinkRegex = /<a\s+href=["'](#|javascript:void\(0\)|)["'][^>]*>(.*?)<\/a>/gi;
  let linkMatch;
  let linkCount = 0;
  while ((linkMatch = deadLinkRegex.exec(html)) !== null && linkCount < 3) {
    linkCount++;
    const original = linkMatch[0];
    const fixed = original.replace(/href=["'][^"']*["']/, 'href="#main-content"');
    issues.push({
      id: `fix-dead-link-${linkCount}`,
      category: 'broken_links',
      severity: 'medium',
      title: `Dead Anchor Link with Empty/Placeholder Target (#${linkCount})`,
      description: 'Anchor tags with empty or # targets fail keyboard navigation and confuse users.',
      location: `Anchor Tag (#${linkCount})`,
      originalSnippet: original,
      fixedSnippet: fixed,
      applied: false,
    });
  }

  // Issue 5: Missing or Insecure target="_blank"
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
      title: 'Target _blank Without rel="noopener noreferrer"',
      description: 'Vulnerable to reverse tabnabbing and window.opener security leaks.',
      location: `Link #${unsafeCount}`,
      originalSnippet: original,
      fixedSnippet: fixed,
      applied: false,
    });
  }

  // Issue 6: Form Input Missing Associated Label or ID
  const unlabelledInputRegex = /<input(?![^>]*\b(id|aria-label)=)[^>]*>/gi;
  let inputMatch;
  let inputCount = 0;
  while ((inputMatch = unlabelledInputRegex.exec(html)) !== null && inputCount < 3) {
    inputCount++;
    const original = inputMatch[0];
    const fixed = `<label class="form-label">Input Field\n  ${original.replace('<input', `<input id="field-${inputCount}" aria-label="Input Field"`)}\n</label>`;
    issues.push({
      id: `fix-unlabelled-input-${inputCount}`,
      category: 'accessibility',
      severity: 'high',
      title: `Unlabelled Form Input Element (#${inputCount})`,
      description: 'Screen reader users receive no context regarding input purpose.',
      location: `Form Input #${inputCount}`,
      originalSnippet: original,
      fixedSnippet: fixed,
      applied: false,
    });
  }

  // Issue 7: Hardcoded fixed wide CSS widths (e.g. width: 1200px or width: 960px without max-width)
  const fixedWidthRegex = /width\s*:\s*(9[0-9]{2}|1[0-9]{3})px\s*;/gi;
  let widthMatch;
  if ((widthMatch = fixedWidthRegex.exec(css || html)) !== null) {
    const original = widthMatch[0];
    const fixed = `max-width: 100%; width: ${widthMatch[1]}px; box-sizing: border-box;`;
    issues.push({
      id: 'fix-fixed-width',
      category: 'responsiveness',
      severity: 'critical',
      title: 'Non-Responsive Fixed Pixel Width Container',
      description: `Container has hardcoded ${original}, which causes severe horizontal scrollbars on mobile phones.`,
      location: 'CSS Style Rules',
      originalSnippet: original,
      fixedSnippet: fixed,
      applied: false,
    });
  }

  // Issue 8: Missing <title> Tag
  if (!/<title[^>]*>[\s\S]*?<\/title>/i.test(html)) {
    issues.push({
      id: 'fix-seo-title',
      category: 'seo',
      severity: 'high',
      title: 'Missing Document <title> Element',
      description: 'Search engines and browser tabs have no identifiable title name.',
      location: '<head> Section',
      originalSnippet: '<head>',
      fixedSnippet: '<head>\n  <title>Website Title — Built with SiteGen</title>',
      applied: false,
    });
  }

  // Issue 9: Missing Meta Description
  if (!/<meta\s+name=["']description["']/i.test(html)) {
    issues.push({
      id: 'fix-seo-desc',
      category: 'seo',
      severity: 'medium',
      title: 'Missing SEO Meta Description',
      description: 'Search engines will extract random body snippets for search result previews.',
      location: '<head> Section',
      originalSnippet: '<head>',
      fixedSnippet: '<head>\n  <meta name="description" content="Discover our services, portfolio, and products.">',
      applied: false,
    });
  }

  return issues;
}

export function applyIssueFix(html: string, css: string, issue: RepairIssue): { html: string; css: string } {
  let newHtml = html;
  let newCss = css;

  if (issue.category === 'layout' || (issue.category === 'responsiveness' && issue.id === 'fix-fixed-width')) {
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
    } else if (issue.id === 'fix-seo-title' && !/<title/i.test(newHtml)) {
      newHtml = newHtml.replace(/<head>/i, `<head>\n  <title>Repaired Website — SiteGen Studio</title>`);
    } else if (issue.id === 'fix-seo-desc' && !/<meta\s+name=["']description/i.test(newHtml)) {
      newHtml = newHtml.replace(/<head>/i, `<head>\n  <meta name="description" content="Optimized and repaired website by SiteGen AI.">`);
    }
  }

  return { html: newHtml, css: newCss };
}
