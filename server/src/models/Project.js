import mongoose from 'mongoose';

const SectionItemSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    description: String,
    icon: String,
    price: String,
    period: String,
    features: [String],
    author: String,
    role: String,
    avatar: String,
    value: String,
    label: String,
    image: String,
    category: String,
  },
  { _id: false, strict: false }
);

const SectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    content: {
      headline: String,
      subheadline: String,
      badge: String,
      primaryCtaText: String,
      primaryCtaUrl: String,
      secondaryCtaText: String,
      secondaryCtaUrl: String,
      items: [SectionItemSchema],
      links: [{ label: String, url: String, _id: false }],
      copyright: String,
      socials: [{ platform: String, url: String, _id: false }],
      imageUrl: String,
      imageAlt: String,
      buttonText: String,
    },
    styles: {
      bgColor: String,
      textColor: String,
      accentColor: String,
      paddingY: String,
      alignment: String,
      cardStyle: String,
    },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false, strict: false }
);

const PaletteSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    primary: String,
    secondary: String,
    accent: String,
    background: String,
    surface: String,
    text: String,
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    style: { type: String, default: 'futuristic-dark' },
    palette: { type: PaletteSchema, required: true },
    fontFamily: { type: String, default: 'Inter' },
    sections: [SectionSchema],
    prompt: { type: String, default: '' },
    customCss: { type: String, default: '' },
    customJs: { type: String, default: '' },
    qualityScore: { type: Number, default: 95 },
    liveUrl: { type: String, default: '' },
    githubRepo: { type: String, default: '' },
    version: { type: Number, default: 1 },
    ownerId: { type: String, default: 'demo-user', index: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ category: 1, createdAt: -1 });

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
