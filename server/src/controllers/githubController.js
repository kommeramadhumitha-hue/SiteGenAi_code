import { githubService, scanFilesForSecrets } from '../services/githubService.js';
import { mongoService } from '../services/mongoService.js';

export async function getGithubStatus(req, res, next) {
  try {
    const status = githubService.getStatus();
    return res.json({
      success: true,
      ...status,
    });
  } catch (err) {
    next(err);
  }
}

export async function getGithubUser(req, res, next) {
  try {
    const customToken = req.headers['x-github-token'] || req.body?.token;
    const user = await githubService.getAuthenticatedUser(customToken);
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err.message || 'GitHub Authentication failed',
    });
  }
}

export async function listGithubRepos(req, res, next) {
  try {
    const customToken = req.headers['x-github-token'] || req.query?.token;
    const repos = await githubService.listUserRepositories(customToken);
    return res.json({
      success: true,
      repos,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to list GitHub repositories',
    });
  }
}

export async function scanFilesSecurity(req, res, next) {
  try {
    const { files } = req.body;
    if (!files || typeof files !== 'object') {
      return res.status(400).json({ error: 'files object is required for scanning' });
    }
    const scan = scanFilesForSecrets(files);
    return res.json({
      success: true,
      isClean: scan.isClean,
      warnings: scan.warnings,
    });
  } catch (err) {
    next(err);
  }
}

export async function publishToGithub(req, res, next) {
  try {
    const {
      projectId,
      projectName,
      repoName,
      isNewRepo = true,
      branch = 'main',
      commitMessage = 'feat: website generated and published with SiteGen AI',
      files,
      isPrivate = false,
      token,
    } = req.body;

    if (!repoName) {
      return res.status(400).json({ error: 'repoName is required' });
    }
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'deployable files map is required' });
    }

    const customToken = req.headers['x-github-token'] || token;

    // Check if token exists
    const status = githubService.getStatus();
    if (!customToken && !status.configured) {
      return res.status(400).json({
        success: false,
        error: 'GitHub credentials are not configured on the server, and no valid Personal Access Token was supplied. Please configure GITHUB_TOKEN or supply an authenticated token.',
        isBlocked: true,
        setupGuide: {
          step1: 'Generate a GitHub Personal Access Token at https://github.com/settings/tokens with "repo" scope.',
          step2: 'Add GITHUB_TOKEN=<token> to server/.env or configure it in the SiteGen AI Settings page.',
        },
      });
    }

    const result = await githubService.publishRepository({
      repoName,
      isNewRepo,
      branch,
      commitMessage,
      files,
      isPrivate,
      customToken,
    });

    // Save publishing audit record to MongoDB Atlas / fallback
    const publishRecord = {
      publishId: 'pub-' + Date.now().toString(36),
      projectId: projectId || 'proj-unknown',
      projectName: projectName || repoName,
      repoName: result.repoName,
      repoUrl: result.repoUrl,
      branch: result.branch,
      commitHash: result.commitHash,
      commitMessage,
      filesCount: result.filesCommitted,
      status: 'success',
      createdAt: result.publishedAt,
    };

    await mongoService.savePublishRecord(publishRecord);

    return res.json({
      success: true,
      ...result,
      record: publishRecord,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'GitHub publish operation failed',
    });
  }
}

export async function getPublishHistory(req, res, next) {
  try {
    const { projectId } = req.query;
    const history = await mongoService.getPublishRecords(projectId);
    return res.json({
      success: true,
      history,
    });
  } catch (err) {
    next(err);
  }
}
