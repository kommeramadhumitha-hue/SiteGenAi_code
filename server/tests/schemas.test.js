import { describe, it, expect } from 'vitest';
import {
  SectionTypeSchema,
  GenerationRequestSchema,
  WebsiteProjectSchema,
  RepairRequestSchema,
} from '../src/schemas/websiteSchemas.js';

describe('Zod Schema Validation Tests', () => {
  it('validates allowed SectionType enum values', () => {
    expect(SectionTypeSchema.safeParse('navbar').success).toBe(true);
    expect(SectionTypeSchema.safeParse('hero').success).toBe(true);
    expect(SectionTypeSchema.safeParse('pricing').success).toBe(true);
    expect(SectionTypeSchema.safeParse('testimonials').success).toBe(true);
    expect(SectionTypeSchema.safeParse('invalid_random_section').success).toBe(false);
  });

  it('validates GenerationRequestSchema', () => {
    const valid = {
      prompt: 'A modern AI developer portfolio website',
      category: 'portfolio',
      language: 'en',
    };
    expect(GenerationRequestSchema.safeParse(valid).success).toBe(true);

    const tooShort = { prompt: 'a' };
    expect(GenerationRequestSchema.safeParse(tooShort).success).toBe(false);
  });

  it('validates RepairRequestSchema requires non-empty HTML', () => {
    expect(RepairRequestSchema.safeParse({ html: '<html><body>Hello</body></html>' }).success).toBe(true);
    expect(RepairRequestSchema.safeParse({ html: '' }).success).toBe(false);
  });

  it('validates complete WebsiteProject structure', () => {
    const mockProject = {
      id: 'proj-test-1',
      name: 'Omnia AI',
      category: 'saas',
      style: 'futuristic-dark',
      palette: {
        id: 'cyber-violet',
        name: 'Cyber Violet',
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        background: '#070a13',
        surface: '#0f172a',
        text: '#f8fafc',
      },
      fontFamily: 'Inter',
      sections: [
        {
          id: 'sec-nav-1',
          type: 'navbar',
          title: 'Navigation',
          isVisible: true,
          content: {
            headline: 'Omnia AI',
          },
        },
        {
          id: 'sec-hero-1',
          type: 'hero',
          title: 'Hero Banner',
          isVisible: true,
          content: {
            headline: 'Build Smarter',
            subheadline: 'Subheadline copy text',
          },
        },
      ],
      prompt: 'Build SaaS website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = WebsiteProjectSchema.safeParse(mockProject);
    expect(result.success).toBe(true);
  });
});
