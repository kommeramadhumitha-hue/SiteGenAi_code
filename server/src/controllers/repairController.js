import { analyzeAndDiagnoseCode, applySingleFixToCode } from '../services/repairService.js';
import { mongoService } from '../services/mongoService.js';

export async function analyzeRepair(req, res, next) {
  try {
    const { html = '', css = '', projectId } = req.body;

    if (!html || html.trim().length === 0) {
      return res.status(400).json({ error: 'HTML markup is required for repair analysis' });
    }

    const diagnosis = analyzeAndDiagnoseCode(html, css);

    return res.json({
      success: true,
      issues: diagnosis.issues,
      summary: diagnosis.summary,
      analyzedAt: diagnosis.analyzedAt,
    });
  } catch (err) {
    next(err);
  }
}

export async function applyRepairFix(req, res, next) {
  try {
    const { html = '', css = '', issue, applyAll = false, issues = [] } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'Source HTML is required' });
    }

    let updatedHtml = html;
    let updatedCss = css;

    if (applyAll && Array.isArray(issues)) {
      for (const item of issues) {
        const res = applySingleFixToCode(updatedHtml, updatedCss, item);
        updatedHtml = res.html;
        updatedCss = res.css;
      }
    } else if (issue) {
      const res = applySingleFixToCode(updatedHtml, updatedCss, issue);
      updatedHtml = res.html;
      updatedCss = res.css;
    }

    return res.json({
      success: true,
      html: updatedHtml,
      css: updatedCss,
      message: applyAll ? 'Applied all verified patches.' : `Applied patch for ${issue?.title || 'flaw'}.`,
    });
  } catch (err) {
    next(err);
  }
}
