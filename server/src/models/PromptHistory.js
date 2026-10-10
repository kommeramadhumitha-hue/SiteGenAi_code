import mongoose from 'mongoose';

const PromptHistorySchema = new mongoose.Schema(
  {
    projectId: { type: String, index: true },
    prompt: { type: String, required: true },
    operationType: {
      type: String,
      enum: ['generation', 'chat_edit', 'regenerate_section', 'repair'],
      default: 'generation',
    },
    language: { type: String, enum: ['en', 'te'], default: 'en' },
    durationMs: { type: Number, default: 0 },
    provider: { type: String, default: 'gemini' },
    success: { type: Boolean, default: true },
    error: { type: String },
  },
  {
    timestamps: true,
  }
);

PromptHistorySchema.index({ projectId: 1, createdAt: -1 });

export const PromptHistory =
  mongoose.models.PromptHistory || mongoose.model('PromptHistory', PromptHistorySchema);
