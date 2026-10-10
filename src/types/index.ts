export type SectionType =
  | 'navbar'
  | 'hero'
  | 'features'
  | 'about'
  | 'product'
  | 'pricing'
  | 'testimonials'
  | 'statistics'
  | 'gallery'
  | 'team'
  | 'faq'
  | 'blog'
  | 'contact'
  | 'newsletter'
  | 'cta'
  | 'footer';

export interface SectionContent {
  headline?: string;
  subheadline?: string;
  badge?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  items?: Array<{
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    price?: string;
    period?: string;
    features?: string[];
    author?: string;
    role?: string;
    avatar?: string;
    value?: string;
    label?: string;
    image?: string;
    category?: string;
  }>;
  links?: Array<{ label: string; url: string }>;
  copyright?: string;
  socials?: Array<{ platform: string; url: string }>;
  emailPlaceholder?: string;
  buttonText?: string;
  imageUrl?: string;
  imageAlt?: string;
  formFields?: Array<{ name: string; label: string; type: string; placeholder?: string }>;
  [key: string]: any;
}

export interface SectionStyles {
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  paddingY?: 'compact' | 'normal' | 'spacious';
  alignment?: 'left' | 'center' | 'right';
  cardStyle?: 'glass' | 'solid' | 'bordered';
}

export interface WebsiteSection {
  id: string;
  type: SectionType;
  title: string;
  content: SectionContent;
  styles?: SectionStyles;
  isVisible: boolean;
}

export type WebsiteCategory =
  | 'saas'
  | 'portfolio'
  | 'business'
  | 'landing'
  | 'blog'
  | 'restaurant'
  | 'education'
  | 'ecommerce'
  | 'agency'
  | 'documentation'
  | 'custom';

export type WebsiteStyle =
  | 'futuristic-dark'
  | 'modern-minimal'
  | 'vibrant-gradient'
  | 'glassmorphism'
  | 'corporate-clean'
  | 'creative-bold'
  | 'warm-editorial';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

export interface WebsiteProject {
  id: string;
  name: string;
  category: WebsiteCategory;
  style: WebsiteStyle;
  palette: ColorPalette;
  fontFamily: 'Inter' | 'Poppins' | 'Outfit' | 'Plus Jakarta Sans' | 'JetBrains Mono';
  sections: WebsiteSection[];
  prompt: string;
  customCss?: string;
  customJs?: string;
  createdAt: string;
  updatedAt: string;
  qualityScore?: number;
  githubRepo?: string;
  liveUrl?: string;
  _meta?: {
    isSimulated?: boolean;
    provider?: string;
    model?: string;
    error?: string | null;
    fallbackReason?: string;
    generatedAt?: string;
  };
}

export interface QualityCheck {
  id: string;
  category: 'accessibility' | 'responsiveness' | 'seo' | 'links' | 'html' | 'performance';
  name: string;
  description: string;
  status: 'passed' | 'warning' | 'failed' | 'unavailable';
  isEstimated: boolean;
  scoreImpact: number;
  explanation: string;
  fixRecommendation: string;
  location?: string;
}

export interface QualityReport {
  overallScore: number;
  isMeasured: boolean;
  checks: QualityCheck[];
  summary: {
    passed: number;
    warning: number;
    failed: number;
    unavailable: number;
  };
  analyzedAt: string;
}

export interface RepairIssue {
  id: string;
  category: 'layout' | 'responsiveness' | 'css' | 'broken_links' | 'accessibility' | 'seo' | 'html_syntax';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  originalSnippet: string;
  fixedSnippet: string;
  applied: boolean;
  verified?: boolean;
  verificationStatus?: 'pending' | 'verified_fixed' | 'unresolved' | 'regressed';
  verificationMessage?: string;
  explanation?: string;
  aiEnhanced?: boolean;
  scoreImpact?: number;
}

export interface Template {
  id: string;
  title: string;
  category: WebsiteCategory;
  description: string;
  previewGradient: string;
  tags: string[];
  features: string[];
  defaultProject: Partial<WebsiteProject>;
}

export type DeploymentProvider = 'sitegen-cloud' | 'vercel' | 'netlify' | 'cloudflare' | 'github_pages';

export interface DeploymentRecord {
  id: string;
  projectId: string;
  projectName: string;
  provider: DeploymentProvider;
  status: 'building' | 'ready' | 'failed';
  publicUrl: string;
  commitHash: string;
  branch: string;
  createdAt: string;
  buildTimeMs: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'midnight' | 'cyberpunk';
  reducedMotion: boolean;
  language: 'en' | 'te';
  defaultExportFormat: 'html' | 'react';
  integrations: {
    aiProvider: 'gemini' | 'openai' | 'anthropic';
    aiApiKeyConfigured: boolean;
    aiApiKeyMasked: string;
    mongoDbConnected: boolean;
    mongoDbUriConfigured: boolean;
    githubConnected: boolean;
    githubUsername: string;
    githubTokenConfigured: boolean;
    githubPat?: string;
    deploymentProviderConnected: boolean;
    deploymentTokenConfigured: boolean;
    vercelTokenConfigured?: boolean;
    vercelToken?: string;
    netlifyTokenConfigured?: boolean;
    netlifyToken?: string;
  };
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'free' | 'pro' | 'enterprise';
  isDemoAccount: boolean;
}

export interface ContentSuggestion {
  topic: string;
  format: string;
  targetIntent: string;
  outline: string;
}

export interface CalendarDayItem {
  day: string;
  platform: string;
  theme: string;
  caption: string;
  assetType: string;
  suggestedTime: string;
}

export interface MarketingStrategy {
  seo: {
    title: string;
    metaDescription: string;
    primaryKeywords: string[];
    secondaryKeywords: string[];
    contentSuggestions: ContentSuggestion[];
  };
  socialMedia: {
    instagram: {
      postText: string;
      imageIdea: string;
      hashtags: string[];
    };
    facebook: {
      postText: string;
      callToAction: string;
      hashtags: string[];
    };
    contentCalendar: CalendarDayItem[];
  };
  paidAdvertising: {
    googleAds: {
      headlines: string[];
      descriptions: string[];
      campaignObjective: string;
      suggestedDailyBudget: string;
      targetKeywords: string[];
    };
    metaAds: {
      primaryCopy: string;
      headlines: string[];
      targetAudience: {
        demographics: string;
        interests: string[];
        behaviors: string;
      };
      campaignObjective: string;
      suggestedDailyBudget: string;
    };
  };
  marketingScore: {
    overallScore: number;
    breakdown: {
      seo: number;
      responsiveness: number;
      callsToAction: number;
      contactDetails: number;
    };
    strengths: string[];
    recommendations: string[];
  };
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

