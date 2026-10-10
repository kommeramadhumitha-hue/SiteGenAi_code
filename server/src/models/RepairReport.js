import mongoose from 'mongoose';

const RepairReportSchema = new mongoose.Schema(
  {
    projectId: { type: String, index: true },
    sourceHtmlLength: { type: Number, required: true },
    sourceCssLength: { type: Number, default: 0 },
    issuesFound: { type: Array, default: [] },
    appliedFixes: { type: Array, default: [] },
    summary: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const RepairReport =
  mongoose.models.RepairReport || mongoose.model('RepairReport', RepairReportSchema);
