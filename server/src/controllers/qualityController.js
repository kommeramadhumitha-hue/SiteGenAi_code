import { evaluateQuality } from '../services/qualityService.js';

export async function runQualityAudit(req, res, next) {
  try {
    const { html = '', css = '' } = req.body;

    if (!html || html.trim().length === 0) {
      return res.status(400).json({ error: 'HTML markup is required for quality audit' });
    }

    const report = evaluateQuality(html, css);

    return res.json({
      success: true,
      report,
    });
  } catch (err) {
    next(err);
  }
}
