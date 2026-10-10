import { WebsiteProjectSchema } from '../../schemas/websiteSchemas.js';

export class ValidationAgent {
  constructor() {
    this.role = 'Quality & Schema Validation Agent';
  }

  validate(rawProject) {
    const issues = [];

    // Ensure ID and timestamp fields exist
    const normalized = {
      ...rawProject,
      id: rawProject.id || 'proj-' + Math.random().toString(36).substring(2, 9),
      createdAt: rawProject.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qualityScore: rawProject.qualityScore || 95,
      sections: Array.isArray(rawProject.sections) ? rawProject.sections : [],
    };

    // 1. Zod Schema Validation
    const parsed = WebsiteProjectSchema.safeParse(normalized);
    if (!parsed.success) {
      issues.push({
        type: 'schema',
        message: 'Zod schema validation deviations detected',
        details: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      });
    }

    // 2. Section count check
    if (normalized.sections.length < 3) {
      issues.push({
        type: 'structural',
        message: `Generated site only contains ${normalized.sections.length} sections. Minimum expected is 3.`,
      });
    }

    // 3. Duplicate section IDs check
    const idSet = new Set();
    normalized.sections.forEach((sec, idx) => {
      if (!sec.id) {
        sec.id = `sec-${sec.type || 'gen'}-${idx + 1}`;
      }
      if (idSet.has(sec.id)) {
        sec.id = `${sec.id}-${idx}`;
      }
      idSet.add(sec.id);
    });

    return {
      isValid: issues.length === 0,
      issues,
      sanitizedProject: normalized,
    };
  }
}
