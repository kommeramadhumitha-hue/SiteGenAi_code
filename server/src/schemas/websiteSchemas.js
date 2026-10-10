import { z } from 'zod';

export const SectionTypeSchema = z.enum([
  'navbar',
  'hero',
  'features',
  'about',
  'product',
  'pricing',
  'testimonials',
  'statistics',
  'gallery',
  'team',
  'faq',
  'blog',
  'contact',
  'newsletter',
  'cta',
  'footer',
]);

export const WebsiteCategorySchema = z.enum([
  'saas',
  'portfolio',
  'business',
  'landing',
  'blog',
  'restaurant',
  'education',
  'ecommerce',
  'agency',
  'documentation',
  'custom',
]);

export const WebsiteStyleSchema = z.enum([
  'futuristic-dark',
  'modern-minimal',
  'vibrant-gradient',
  'glassmorphism',
  'corporate-clean',
  'creative-bold',
  'warm-editorial',
]);

export const ColorPaletteSchema = z.object({
  id: z.string().default('palette-custom'),
  name: z.string().default('Tailored Palette'),
  primary: z.string().default('#6366f1'),
  secondary: z.string().default('#4f46e5'),
  accent: z.string().default('#8b5cf6'),
  background: z.string().default('#070a13'),
  surface: z.string().default('#0f172a'),
  text: z.string().default('#f8fafc'),
});

export const SectionItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  price: z.string().optional(),
  period: z.string().optional(),
  features: z.array(z.string()).optional(),
  author: z.string().optional(),
  role: z.string().optional(),
  avatar: z.string().optional(),
  value: z.string().optional(),
  label: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
}).passthrough();

export const SectionContentSchema = z.object({
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  badge: z.string().optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaUrl: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaUrl: z.string().optional(),
  items: z.array(SectionItemSchema).optional(),
  links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  copyright: z.string().optional(),
  socials: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  buttonText: z.string().optional(),
}).passthrough();

export const SectionStylesSchema = z.object({
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  accentColor: z.string().optional(),
  paddingY: z.enum(['compact', 'normal', 'spacious']).optional(),
  alignment: z.enum(['left', 'center', 'right']).optional(),
  cardStyle: z.enum(['glass', 'solid', 'bordered']).optional(),
}).optional();

export const WebsiteSectionSchema = z.object({
  id: z.string(),
  type: SectionTypeSchema,
  title: z.string(),
  content: SectionContentSchema,
  styles: SectionStylesSchema,
  isVisible: z.boolean().default(true),
});

export const WebsiteProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: WebsiteCategorySchema,
  style: WebsiteStyleSchema.default('futuristic-dark'),
  palette: ColorPaletteSchema,
  fontFamily: z.enum(['Inter', 'Poppins', 'Outfit', 'Plus Jakarta Sans', 'JetBrains Mono']).default('Inter'),
  sections: z.array(WebsiteSectionSchema),
  prompt: z.string().default(''),
  customCss: z.string().optional().default(''),
  customJs: z.string().optional().default(''),
  createdAt: z.string(),
  updatedAt: z.string(),
  qualityScore: z.number().optional().default(95),
  liveUrl: z.string().optional(),
  githubRepo: z.string().optional(),
});

// Request Schemas
export const GenerationRequestSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long').max(2000),
  category: WebsiteCategorySchema.default('saas'),
  style: WebsiteStyleSchema.optional(),
  language: z.enum(['en', 'te']).default('en'),
  referenceImageBase64: z.string().optional(),
});

export const ChatEditRequestSchema = z.object({
  instruction: z.string().min(2, 'Instruction cannot be empty').max(1000),
  project: WebsiteProjectSchema,
  targetSectionId: z.string().optional(),
  language: z.enum(['en', 'te']).default('en'),
});

export const RegenerateSectionRequestSchema = z.object({
  project: WebsiteProjectSchema,
  sectionId: z.string(),
  instruction: z.string().optional(),
  language: z.enum(['en', 'te']).default('en'),
});

export const RepairRequestSchema = z.object({
  html: z.string().min(1, 'HTML markup is required'),
  css: z.string().optional().default(''),
});

export const QualityAuditRequestSchema = z.object({
  html: z.string().min(1, 'HTML markup is required'),
  css: z.string().optional().default(''),
});

export const AssistantConsultRequestSchema = z.object({
  message: z.string().min(2, 'Message cannot be empty').max(2000),
  language: z.enum(['en', 'te']).default('en'),
  mode: z.enum(['build', 'repair', 'general']).default('repair'),
  context: z
    .object({
      html: z.string().optional(),
      css: z.string().optional(),
      detectedIssues: z.array(z.any()).optional(),
      projectName: z.string().optional(),
    })
    .optional(),
});

export const MarketingStrategyRequestSchema = z.object({
  projectName: z.string().default('My Brand Website'),
  category: z.string().default('business'),
  targetAudience: z.string().optional().default(''),
  keyBenefits: z.string().optional().default(''),
  websiteUrl: z.string().optional().default(''),
  language: z.enum(['en', 'te']).default('en'),
  projectContext: z.record(z.any()).optional(),
});

