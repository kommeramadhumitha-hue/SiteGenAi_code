import fs from 'fs';
import path from 'path';
import { Project, ProjectVersion, PromptHistory, DeploymentRecord, GithubPublishRecord } from '../models/index.js';
import { getDatabaseStatus } from '../config/database.js';

// Local storage fallback cache path
const DATA_DIR = path.resolve('server/data');
const BACKUP_FILE = path.join(DATA_DIR, 'local_projects.json');
const DEPLOYMENTS_BACKUP_FILE = path.join(DATA_DIR, 'local_deployments.json');
const PUBLISH_BACKUP_FILE = path.join(DATA_DIR, 'local_publishes.json');

// Ensure local fallback directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create fallback data dir', err);
  }
}

// In-memory fallback cache
let memoryProjects = [];
let memoryDeployments = [];
let memoryPublishes = [];

try {
  if (fs.existsSync(BACKUP_FILE)) {
    const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
    memoryProjects = JSON.parse(raw);
  }
} catch {
  memoryProjects = [];
}

try {
  if (fs.existsSync(DEPLOYMENTS_BACKUP_FILE)) {
    memoryDeployments = JSON.parse(fs.readFileSync(DEPLOYMENTS_BACKUP_FILE, 'utf-8'));
  }
} catch {
  memoryDeployments = [];
}

try {
  if (fs.existsSync(PUBLISH_BACKUP_FILE)) {
    memoryPublishes = JSON.parse(fs.readFileSync(PUBLISH_BACKUP_FILE, 'utf-8'));
  }
} catch {
  memoryPublishes = [];
}

function persistMemoryFallback() {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(memoryProjects, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Storage] Failed to save fallback cache:', err.message);
  }
}

export const mongoService = {
  async listProjects({ page = 1, limit = 20, search = '', category = '', ownerId = null } = {}) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const query = {};
      if (ownerId) {
        query.ownerId = ownerId;
      }
      if (category && category !== 'all') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { prompt: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await Project.countDocuments(query);
      const docs = await Project.find(query)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        projects: docs.map((d) => ({ ...d, id: d.projectId })),
        total,
        page,
        limit,
        isUsingDatabase: true,
      };
    }

    // Fallback store
    let filtered = [...memoryProjects];
    if (ownerId) {
      filtered = filtered.filter((p) => !p.ownerId || p.ownerId === ownerId);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name?.toLowerCase().includes(s) || p.prompt?.toLowerCase().includes(s)
      );
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      projects: paginated,
      total,
      page,
      limit,
      isUsingDatabase: false,
    };
  },

  async getProjectById(projectId, ownerId = null) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const query = { projectId };
      if (ownerId) query.ownerId = ownerId;
      const doc = await Project.findOne(query).lean();
      return doc ? { ...doc, id: doc.projectId } : null;
    }

    return memoryProjects.find((p) => (p.id === projectId || p.projectId === projectId) && (!ownerId || !p.ownerId || p.ownerId === ownerId)) || null;
  },

  async saveProject(projectData, ownerId = null) {
    const { isConnected } = getDatabaseStatus();
    const id = projectData.id || projectData.projectId || 'proj-' + Date.now().toString(36);
    const resolvedOwnerId = ownerId || projectData.ownerId || 'user-default';

    const normalized = {
      ...projectData,
      id,
      projectId: id,
      ownerId: resolvedOwnerId,
      updatedAt: new Date().toISOString(),
    };

    if (isConnected) {
      const updatedDoc = await Project.findOneAndUpdate(
        { projectId: id },
        { ...normalized },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      return { ...updatedDoc, id: updatedDoc.projectId, isUsingDatabase: true };
    }

    // Fallback
    const existingIndex = memoryProjects.findIndex((p) => p.id === id || p.projectId === id);
    if (existingIndex !== -1) {
      memoryProjects[existingIndex] = normalized;
    } else {
      memoryProjects.unshift(normalized);
    }
    persistMemoryFallback();

    return { ...normalized, isUsingDatabase: false };
  },

  async deleteProject(projectId, ownerId = null) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const query = { projectId };
      if (ownerId) query.ownerId = ownerId;
      await Project.deleteOne(query);
      await ProjectVersion.deleteMany({ projectId });
      return true;
    }

    memoryProjects = memoryProjects.filter((p) => (p.id !== projectId && p.projectId !== projectId) || (ownerId && p.ownerId && p.ownerId !== ownerId));
    persistMemoryFallback();
    return true;
  },

  async duplicateProject(projectId) {
    const original = await this.getProjectById(projectId);
    if (!original) throw new Error('Project not found');

    const newId = 'proj-' + Math.random().toString(36).substring(2, 9);
    const duplicated = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      projectId: newId,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await this.saveProject(duplicated);
  },

  async saveProjectVersion(projectId, snapshot, changeSummary = 'Saved version') {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const count = await ProjectVersion.countDocuments({ projectId });
      const versionDoc = await ProjectVersion.create({
        projectId,
        versionNumber: count + 1,
        snapshot,
        changeSummary,
      });
      return versionDoc.toObject();
    }

    return {
      projectId,
      versionNumber: Date.now(),
      snapshot,
      changeSummary,
      createdAt: new Date().toISOString(),
    };
  },

  async getProjectVersions(projectId) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      return await ProjectVersion.find({ projectId }).sort({ versionNumber: -1 }).lean();
    }

    return [];
  },

  async logPrompt({ projectId, prompt, operationType, language, durationMs, provider, success, error }) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      try {
        await PromptHistory.create({
          projectId,
          prompt,
          operationType,
          language,
          durationMs,
          provider,
          success,
          error,
        });
      } catch (err) {
        console.warn('Failed to log prompt history:', err.message);
      }
    }
  },

  async getPromptHistory(projectId) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      return await PromptHistory.find({ projectId }).sort({ createdAt: -1 }).limit(30).lean();
    }

    return [];
  },

  async saveDeployment(deploymentData) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const doc = await DeploymentRecord.create(deploymentData);
      return doc.toObject();
    }

    // Persist to local fallback cache
    memoryDeployments.unshift(deploymentData);
    if (memoryDeployments.length > 50) memoryDeployments = memoryDeployments.slice(0, 50);
    try {
      fs.writeFileSync(DEPLOYMENTS_BACKUP_FILE, JSON.stringify(memoryDeployments, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to persist memoryDeployments', e.message);
    }
    return deploymentData;
  },

  async getDeployments(projectId) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const query = projectId ? { projectId } : {};
      return await DeploymentRecord.find(query).sort({ createdAt: -1 }).limit(30).lean();
    }

    if (projectId) {
      return memoryDeployments.filter((d) => d.projectId === projectId);
    }
    return memoryDeployments;
  },

  async savePublishRecord(recordData) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const doc = await GithubPublishRecord.create(recordData);
      return doc.toObject();
    }

    memoryPublishes.unshift(recordData);
    if (memoryPublishes.length > 50) memoryPublishes = memoryPublishes.slice(0, 50);
    try {
      fs.writeFileSync(PUBLISH_BACKUP_FILE, JSON.stringify(memoryPublishes, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to persist memoryPublishes', e.message);
    }
    return recordData;
  },

  async getPublishRecords(projectId) {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const query = projectId ? { projectId } : {};
      return await GithubPublishRecord.find(query).sort({ createdAt: -1 }).limit(30).lean();
    }

    if (projectId) {
      return memoryPublishes.filter((p) => p.projectId === projectId);
    }
    return memoryPublishes;
  },
};
