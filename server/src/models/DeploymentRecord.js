import mongoose from 'mongoose';

const DeploymentRecordSchema = new mongoose.Schema(
  {
    deploymentId: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    provider: {
      type: String,
      enum: ['vercel', 'netlify', 'cloudflare', 'github_pages'],
      default: 'vercel',
    },
    status: {
      type: String,
      enum: ['building', 'ready', 'failed'],
      default: 'ready',
    },
    publicUrl: { type: String, required: true },
    commitHash: { type: String, default: '' },
    branch: { type: String, default: 'main' },
    buildTimeMs: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

DeploymentRecordSchema.index({ projectId: 1, createdAt: -1 });

export const DeploymentRecord =
  mongoose.models.DeploymentRecord || mongoose.model('DeploymentRecord', DeploymentRecordSchema);
