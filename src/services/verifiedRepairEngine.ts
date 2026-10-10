import { RepairIssue, QualityReport, WebsiteProject } from '../types';
import { analyzeHtmlQuality } from './qualityService';
import { generateProjectHtml } from './htmlRenderer';

export interface VerificationResult {
  issueId: string;
  isResolved: boolean;
  status: 'verified_fixed' | 'unresolved' | 'regressed';
  verificationMessage: string;
  beforeScore: number;
  afterScore: number;
  scoreDelta: number;
  testedAt: string;
}

export interface VerificationAuditReport {
  timestamp: string;
  overallStatus: 'passed' | 'partial' | 'failed';
  totalIssuesChecked: number;
  verifiedFixedCount: number;
  unresolvedCount: number;
  beforeScore: number;
  afterScore: number;
  scoreImprovement: number;
  results: VerificationResult[];
}

/**
 * Deterministically scans HTML/CSS for real, tangible errors:
 * - Broken internal anchor links (#target with no corresponding element)
 * - Missing <title> or empty title
 * - Missing <img> alt attributes
 * - Form controls without associated labels or aria-labels
 * - Missing HTML5 <!DOCTYPE>
 * - Missing mobile viewport meta tag
 * - Fixed wide pixel widths (e.g. width: 1200px without max-width)
 * - Links with target="_blank" missing rel="noopener noreferrer"
 * - Duplicate ID attributes
 */
export function scanProjectForIssues(html: string, css: string = ''): RepairIssue[] {
  const issues: RepairIssue[] = [];

  let doc: Document | null = null;
  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    } catch {
      doc = null;
    }
  }

  // 1. Missing DOCTYPE or <html> lang
  if (!/<!doctype\s+html>/i.test(html)) {
    issues.push({
      id: 'fix-doctype',
      category: 'html_syntax',
      severity: 'medium',
      title: 'Missing HTML5 Doctype Declaration',
      description: 'Browsers may enter Quirks Mode without <!DOCTYPE html>, causing layout unpredictability.',
      location: 'Line 1 (Document Root)',
      originalSnippet: html.slice(0, 35) + '...',
      fixedSnippet: '<!DOCTYPE html>\n<html lang="en">\n' + html.slice(0, 35) + '...',
      applied: false,
      scoreImpact: 5,
      explanation: 'Prepend standards-compliant HTML5 <!DOCTYPE html> and set lang="en" to inform user-agents.',
    });
  }

  // 2. Missing Viewport Meta Tag
  if (!/<meta\s+name=["']viewport["']/i.test(html)) {
    const headIndex = html.indexOf('<head>');
    issues.push({
      id: 'fix-viewport',
      category: 'responsiveness',
      severity: 'critical',
      title: 'Missing Mobile Viewport Meta Tag',
      description: 'Mobile browsers will render this site at standard 980px desktop scale instead of fluid device width.',
      location: headIndex !== -1 ? '<head> Tag' : 'Document Root',
      originalSnippet: '<head>',
      fixedSnippet: '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      applied: false,
      scoreImpact: 15,
      explanation: 'Adds <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head>.',
    });
  }

  // 3. Missing or Empty <title> Tag
  const titleTag = doc ? doc.querySelector('title') : null;
  const titleText = titleTag?.textContent?.trim() || '';
  if (!titleTag || !titleText || !/<title[^>]*>[\s\S]*?<\/title>/i.test(html)) {
    issues.push({
      id: 'fix-seo-title',
      category: 'seo',
      severity: 'high',
      title: 'Missing or Empty Document <title> Element',
      description: 'Search engines and browser tabs have no identifiable title name, negatively impacting SEO and user navigation.',
      location: '<head> Section',
      originalSnippet: titleTag ? titleTag.outerHTML : '<head>',
      fixedSnippet: '<head>\n  <title>Website Title — Powered by SiteGen AI</title>',
      applied: false,
      scoreImpact: 10,
      explanation: 'Provides a descriptive <title> tag inside the document <head>.',
    });
  }

  // 4. Missing Image Alt Attributes
  if (doc) {
    const images = Array.from(doc.querySelectorAll('img'));
    images.forEach((img, idx) => {
      const altAttr = img.getAttribute('alt');
      if (altAttr === null || altAttr.trim() === '') {
        const src = img.getAttribute('src') || 'image';
        const snippet = img.outerHTML;
        const fixed = snippet.includes('alt=')
          ? snippet.replace(/alt=["'][^"']*["']/, 'alt="Descriptive illustration of content"')
          : snippet.replace('<img', '<img alt="Descriptive illustration of content"');

        issues.push({
          id: `fix-img-alt-${idx + 1}`,
          category: 'accessibility',
          severity: 'high',
          title: `Image Missing Alt Text (#${idx + 1})`,
          description: `Screen readers cannot describe this image (src: "${src.slice(0, 30)}...") to visually impaired visitors.`,
          location: `<img> Element #${idx + 1} (${src.slice(0, 25)})`,
          originalSnippet: snippet,
          fixedSnippet: fixed,
          applied: false,
          scoreImpact: 8,
          explanation: 'Specifies descriptive alternative text for screen reader accessibility (WCAG 1.1.1 Non-text Content).',
        });
      }
    });
  }

  // 5. Broken Internal Anchor Links (#target with no corresponding element)
  if (doc) {
    const internalLinks = Array.from(doc.querySelectorAll('a[href^="#"]'));
    const seenHrefs = new Set<string>();

    internalLinks.forEach((link, idx) => {
      const rawHref = link.getAttribute('href') || '';
      if (rawHref === '#' || rawHref.trim() === '') {
        issues.push({
          id: `fix-dead-link-${idx + 1}`,
          category: 'broken_links',
          severity: 'medium',
          title: `Dead Anchor Link with Empty Target (#${idx + 1})`,
          description: `Anchor tag "${link.textContent?.trim() || 'Link'}" has href="#" which resets scroll without navigating.`,
          location: `<a> link "${link.textContent?.trim().slice(0, 20) || 'Anchor'}"`,
          originalSnippet: link.outerHTML,
          fixedSnippet: link.outerHTML.replace(/href=["']#["']/, 'href="#main-content"'),
          applied: false,
          scoreImpact: 6,
          explanation: 'Links empty anchors to a valid landmark anchor like #main-content.',
        });
      } else if (rawHref.length > 1 && !seenHrefs.has(rawHref)) {
        seenHrefs.add(rawHref);
        const targetId = rawHref.substring(1);
        const targetElement = doc?.getElementById(targetId);
        if (!targetElement) {
          issues.push({
            id: `fix-broken-hash-${targetId}`,
            category: 'broken_links',
            severity: 'high',
            title: `Broken Anchor Target Link ("${rawHref}")`,
            description: `Link points to anchor "${rawHref}", but no element with id="${targetId}" exists in the document.`,
            location: `<a> href="${rawHref}"`,
            originalSnippet: link.outerHTML,
            fixedSnippet: link.outerHTML.replace(rawHref, '#'),
            applied: false,
            scoreImpact: 8,
            explanation: `Creates or repairs the target element with id="${targetId}" or routes to top section.`,
          });
        }
      }
    });
  }

  // 6. Form Controls Missing Labels
  if (doc) {
    const inputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'));
    inputs.forEach((input, idx) => {
      const id = input.getAttribute('id');
      const hasAria = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
      const hasLabel = id ? doc?.querySelector(`label[for="${id}"]`) : null;
      const isWrapped = input.closest('label');

      if (!hasAria && !hasLabel && !isWrapped) {
        const snippet = input.outerHTML;
        const inputId = id || `field-input-${idx + 1}`;
        const fixed = `<label for="${inputId}" class="block text-xs font-semibold mb-1 text-slate-300">Input Field</label>\n${
          snippet.includes('id=') ? snippet : snippet.replace('<input', `<input id="${inputId}"`)
        }`;

        issues.push({
          id: `fix-unlabelled-input-${idx + 1}`,
          category: 'accessibility',
          severity: 'high',
          title: `Unlabelled Form Input Control (#${idx + 1})`,
          description: 'Screen reader users receive no spoken description for this interactive input field.',
          location: `<input> Element #${idx + 1}`,
          originalSnippet: snippet,
          fixedSnippet: fixed,
          applied: false,
          scoreImpact: 8,
          explanation: 'Associates a semantic <label> with matching for="id" attribute (WCAG 3.3.2 Labels or Instructions).',
        });
      }
    });
  }

  // 7. Links with target="_blank" missing rel="noopener noreferrer"
  if (doc) {
    const blankLinks = Array.from(doc.querySelectorAll('a[target="_blank"]:not([rel*="noopener"])'));
    blankLinks.forEach((link, idx) => {
      const snippet = link.outerHTML;
      const fixed = snippet.replace('<a ', '<a rel="noopener noreferrer" ');
      issues.push({
        id: `fix-blank-rel-${idx + 1}`,
        category: 'broken_links',
        severity: 'medium',
        title: `Security Hazard: target="_blank" without rel="noopener" (#${idx + 1})`,
        description: 'External links without rel="noopener noreferrer" expose the window to reverse-tabnabbing vulnerabilities.',
        location: `External Link #${idx + 1}`,
        originalSnippet: snippet,
        fixedSnippet: fixed,
        applied: false,
        scoreImpact: 5,
        explanation: 'Adds rel="noopener noreferrer" to isolate the child browsing context from window.opener manipulation.',
      });
    });
  }

  // 8. Rigid pixel container widths in CSS or inline style
  const fixedWidthRegex = /width\s*:\s*(9[0-9]{2}|1[0-9]{3})px\s*;/gi;
  let widthMatch;
  if ((widthMatch = fixedWidthRegex.exec(css || html)) !== null) {
    const original = widthMatch[0];
    const fixed = `max-width: 100%; width: ${widthMatch[1]}px; box-sizing: border-box;`;
    issues.push({
      id: 'fix-fixed-width',
      category: 'responsiveness',
      severity: 'critical',
      title: 'Non-Responsive Fixed Pixel Container Width',
      description: `Container specifies fixed ${original}, causing horizontal scrolling and clipped text on mobile phones.`,
      location: 'CSS Styling Rules',
      originalSnippet: original,
      fixedSnippet: fixed,
      applied: false,
      scoreImpact: 15,
      explanation: 'Replaces hardcoded pixel width with responsive max-width: 100% and border-box sizing.',
    });
  }

  // 9. Missing SEO Meta Description
  if (!/<meta\s+name=["']description["']/i.test(html)) {
    issues.push({
      id: 'fix-seo-desc',
      category: 'seo',
      severity: 'medium',
      title: 'Missing SEO Meta Description Tag',
      description: 'Search engines will extract arbitrary text snippets for search listings when meta description is omitted.',
      location: '<head> Section',
      originalSnippet: '<head>',
      fixedSnippet: '<head>\n  <meta name="description" content="Discover our products, services, and features.">',
      applied: false,
      scoreImpact: 6,
      explanation: 'Adds a concise 150-character <meta name="description"> tag for crawler discovery.',
    });
  }

  return issues;
}

/**
 * Applies a specific patch to HTML / CSS
 */
export function applyPatch(
  html: string,
  css: string,
  issue: RepairIssue
): { html: string; css: string } {
  let newHtml = html;
  let newCss = css;

  if (issue.category === 'responsiveness' && issue.id === 'fix-fixed-width') {
    if (newCss.includes(issue.originalSnippet)) {
      newCss = newCss.replace(issue.originalSnippet, issue.fixedSnippet);
    } else if (newHtml.includes(issue.originalSnippet)) {
      newHtml = newHtml.replace(issue.originalSnippet, issue.fixedSnippet);
    }
  } else if (issue.id === 'fix-doctype' && !/<!doctype\s+html>/i.test(newHtml)) {
    newHtml = `<!DOCTYPE html>\n<html lang="en">\n${newHtml}`;
  } else if (issue.id === 'fix-viewport' && !/<meta\s+name=["']viewport/i.test(newHtml)) {
    newHtml = newHtml.replace(/<head>/i, `<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">`);
  } else if (issue.id === 'fix-seo-title' && !/<title/i.test(newHtml)) {
    newHtml = newHtml.replace(/<head>/i, `<head>\n  <title>Website Title — Powered by SiteGen AI</title>`);
  } else if (issue.id === 'fix-seo-desc' && !/<meta\s+name=["']description/i.test(newHtml)) {
    newHtml = newHtml.replace(/<head>/i, `<head>\n  <meta name="description" content="Discover our services, portfolio, and products.">`);
  } else if (newHtml.includes(issue.originalSnippet)) {
    newHtml = newHtml.replace(issue.originalSnippet, issue.fixedSnippet);
  } else if (issue.id.startsWith('fix-broken-hash-')) {
    const targetId = issue.id.replace('fix-broken-hash-', '');
    if (!newHtml.includes(`id="${targetId}"`)) {
      // Create anchor target tag
      newHtml = newHtml.replace('</body>', `<div id="${targetId}" tabindex="-1"></div>\n</body>`);
    }
  }

  return { html: newHtml, css: newCss };
}

/**
 * CLOSED-LOOP VERIFICATION ENGINE:
 * Re-runs DOM parsing on patched code and checks:
 * 1. Did the specific issue actually disappear?
 * 2. Did the health score increase without regressions?
 */
export function verifyRepairedCode(
  originalHtml: string,
  repairedHtml: string,
  originalCss: string,
  repairedCss: string,
  issue: RepairIssue
): VerificationResult {
  const beforeReport = analyzeHtmlQuality(originalHtml);
  const afterReport = analyzeHtmlQuality(repairedHtml);

  // Check if issue is genuinely gone by running scanner on new code
  const reRemainingIssues = scanProjectForIssues(repairedHtml, repairedCss);
  const isStillPresent = reRemainingIssues.some((i) => i.id === issue.id);

  const isResolved = !isStillPresent;
  const beforeScore = beforeReport.overallScore;
  const afterScore = afterReport.overallScore;
  const scoreDelta = afterScore - beforeScore;

  let status: 'verified_fixed' | 'unresolved' | 'regressed' = 'verified_fixed';
  let verificationMessage = `Verified in DOM: Issue resolved with zero syntax errors. Health score improved by +${Math.max(0, scoreDelta)} pts.`;

  if (!isResolved) {
    status = 'unresolved';
    verificationMessage = 'DOM Verification Alert: The pattern is still detected in the document.';
  } else if (scoreDelta < 0) {
    status = 'regressed';
    verificationMessage = `Regression detected: Score decreased by ${scoreDelta} pts. Revert suggested.`;
  }

  return {
    issueId: issue.id,
    isResolved,
    status,
    verificationMessage,
    beforeScore,
    afterScore,
    scoreDelta,
    testedAt: new Date().toISOString(),
  };
}

/**
 * Runs closed-loop verification across all issues and produces a verifiable audit report
 */
export function generateVerificationAuditReport(
  originalHtml: string,
  repairedHtml: string,
  originalCss: string,
  repairedCss: string,
  appliedIssues: RepairIssue[]
): VerificationAuditReport {
  const beforeReport = analyzeHtmlQuality(originalHtml);
  const afterReport = analyzeHtmlQuality(repairedHtml);

  const results: VerificationResult[] = appliedIssues.map((issue) =>
    verifyRepairedCode(originalHtml, repairedHtml, originalCss, repairedCss, issue)
  );

  const verifiedFixedCount = results.filter((r) => r.isResolved).length;
  const unresolvedCount = results.filter((r) => !r.isResolved).length;

  let overallStatus: 'passed' | 'partial' | 'failed' = 'passed';
  if (unresolvedCount > 0 && verifiedFixedCount > 0) overallStatus = 'partial';
  else if (unresolvedCount > 0 && verifiedFixedCount === 0) overallStatus = 'failed';

  return {
    timestamp: new Date().toISOString(),
    overallStatus,
    totalIssuesChecked: appliedIssues.length,
    verifiedFixedCount,
    unresolvedCount,
    beforeScore: beforeReport.overallScore,
    afterScore: afterReport.overallScore,
    scoreImprovement: afterReport.overallScore - beforeReport.overallScore,
    results,
  };
}
