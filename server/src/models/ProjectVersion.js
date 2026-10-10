import mongoose from 'mongoose';

const ProjectVersionSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    versionNumber: { type: Number, required: true },
    snapshot: { type: Object, required: true },
    changeSummary: { type: String, default: 'Automated project snapshot' },
    createdBy: { type: String, default: 'user' },
  },
  {
    timestamps: true,
  }
);

ProjectVersionSchema.index({ projectId: 1, versionNumber: -1 });

export const ProjectVersion =
  mongoose.models.ProjectVersion || mongoose.model('ProjectVersion', ProjectVersionSchema);
