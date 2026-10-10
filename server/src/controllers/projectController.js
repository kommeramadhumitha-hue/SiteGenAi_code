import { mongoService } from '../services/mongoService.js';

export async function listProjects(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const ownerId = req.user?.userId;

    const result = await mongoService.listProjects({ page, limit, search, category, ownerId });
    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const ownerId = req.user?.userId;
    const project = await mongoService.getProjectById(id, ownerId);

    if (!project) {
      return res.status(404).json({ error: `Project ${id} not found` });
    }

    return res.json({
      success: true,
      project,
    });
  } catch (err) {
    next(err);
  }
}

export async function saveProject(req, res, next) {
  try {
    const projectData = req.body;
    if (!projectData || !projectData.name) {
      return res.status(400).json({ error: 'Valid project object with name is required' });
    }

    const ownerId = req.user?.userId || 'user-default';
    const saved = await mongoService.saveProject(projectData, ownerId);
    return res.json({
      success: true,
      project: saved,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const ownerId = req.user?.userId;
    await mongoService.deleteProject(id, ownerId);
    return res.json({
      success: true,
      message: `Project ${id} deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

export async function duplicateProject(req, res, next) {
  try {
    const { id } = req.params;
    const duplicated = await mongoService.duplicateProject(id);
    return res.json({
      success: true,
      project: duplicated,
    });
  } catch (err) {
    next(err);
  }
}

export async function getVersions(req, res, next) {
  try {
    const { id } = req.params;
    const versions = await mongoService.getProjectVersions(id);
    return res.json({
      success: true,
      versions,
    });
  } catch (err) {
    next(err);
  }
}

export async function restoreVersion(req, res, next) {
  try {
    const { id, versionId } = req.params;
    const versions = await mongoService.getProjectVersions(id);
    const target = versions.find((v) => String(v._id) === versionId || String(v.versionNumber) === versionId);

    if (!target) {
      return res.status(404).json({ error: 'Target version not found' });
    }

    const restored = await mongoService.saveProject(target.snapshot);
    await mongoService.saveProjectVersion(
      id,
      restored,
      `Restored from Version #${target.versionNumber}`
    );

    return res.json({
      success: true,
      project: restored,
      message: `Successfully rolled back to version #${target.versionNumber}`,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPromptHistory(req, res, next) {
  try {
    const { id } = req.params;
    const history = await mongoService.getPromptHistory(id);
    return res.json({
      success: true,
      history,
    });
  } catch (err) {
    next(err);
  }
}
