import mongoose from 'mongoose';

const GithubPublishRecordSchema = new mongoose.Schema(
  {
    publishId: { type: String, required: true, unique: true, index: true },
    projectId: { type: String, required: true, index: true },
    projectName: { type: String, required: true },
    repoName: { type: String, required: true },
    repoUrl: { type: String, required: true },
    branch: { type: String, default: 'main' },
    commitHash: { type: String, required: true },
    commitMessage: { type: String, default: '' },
    filesCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    error: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

GithubPublishRecordSchema.index({ projectId: 1, createdAt: -1 });

export const GithubPublishRecord =
  mongoose.models.GithubPublishRecord || mongoose.model('GithubPublishRecord', GithubPublishRecordSchema);
