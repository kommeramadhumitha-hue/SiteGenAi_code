import { Router } from 'express';
import { generateWebsite, generateFromSketch, regenerateSection } from '../controllers/generateController.js';
import { chatEdit } from '../controllers/chatController.js';
import { analyzeRepair, applyRepairFix } from '../controllers/repairController.js';
import { runQualityAudit } from '../controllers/qualityController.js';
import { consultAssistant } from '../controllers/assistantController.js';
import { generateMarketingStrategy } from '../controllers/marketingController.js';
import {
  listProjects,
  getProject,
  saveProject,
  deleteProject,
  duplicateProject,
  getVersions,
  restoreVersion,
  getPromptHistory,
} from '../controllers/projectController.js';
import { getHealth } from '../controllers/healthController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import {
  GenerationRequestSchema,
  RepairRequestSchema,
  QualityAuditRequestSchema,
  AssistantConsultRequestSchema,
  MarketingStrategyRequestSchema,
} from '../schemas/websiteSchemas.js';
import {
  getGithubStatus,
  getGithubUser,
  listGithubRepos,
  scanFilesSecurity,
  publishToGithub,
  getPublishHistory,
} from '../controllers/githubController.js';
import {
  getDeploymentStatus,
  triggerDeployment,
  checkDeploymentHealth,
  listDeployments,
} from '../controllers/deploymentController.js';

import { register, login, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', getHealth);

// Authentication Endpoints
apiRouter.post('/auth/register', register);
apiRouter.post('/auth/login', login);
apiRouter.get('/auth/me', requireAuth, getMe);

// AI Website Generation Pipeline (Protected by mandatory authentication)
apiRouter.post('/generate', requireAuth, aiRateLimiter, validateBody(GenerationRequestSchema), generateWebsite);
apiRouter.post('/generate/sketch', requireAuth, aiRateLimiter, generateFromSketch);
apiRouter.post('/generate/section', requireAuth, aiRateLimiter, regenerateSection);

// Conversational Editing
apiRouter.post('/chat-edit', requireAuth, aiRateLimiter, chatEdit);

// Bilingual AI Assistant (Telugu + English)
apiRouter.post('/assistant/consult', validateBody(AssistantConsultRequestSchema), consultAssistant);

// Code Repair Studio
apiRouter.post('/repair/diagnose', validateBody(RepairRequestSchema), analyzeRepair);
apiRouter.post('/repair/apply', applyRepairFix);

// Quality & Testing Lab
apiRouter.post('/quality/audit', validateBody(QualityAuditRequestSchema), runQualityAudit);

// AI Marketing Assistant
apiRouter.post('/marketing/strategy', aiRateLimiter, validateBody(MarketingStrategyRequestSchema), generateMarketingStrategy);

// Project Management & MongoDB Persistence (Protected by mandatory authentication & ownership)
apiRouter.get('/projects', requireAuth, listProjects);
apiRouter.post('/projects', requireAuth, saveProject);
apiRouter.get('/projects/:id', requireAuth, getProject);
apiRouter.delete('/projects/:id', requireAuth, deleteProject);
apiRouter.post('/projects/:id/duplicate', requireAuth, duplicateProject);
apiRouter.get('/projects/:id/versions', requireAuth, getVersions);
apiRouter.post('/projects/:id/versions/:versionId/restore', requireAuth, restoreVersion);
apiRouter.get('/projects/:id/prompts', requireAuth, getPromptHistory);

// GitHub Publishing Pipeline
apiRouter.get('/github/status', getGithubStatus);
apiRouter.get('/github/user', getGithubUser);
apiRouter.get('/github/repos', listGithubRepos);
apiRouter.post('/github/scan-security', scanFilesSecurity);
apiRouter.post('/github/publish', publishToGithub);
apiRouter.get('/github/history', getPublishHistory);

// Live Hosting Deployment Pipeline
apiRouter.get('/deploy/status', getDeploymentStatus);
apiRouter.post('/deploy', triggerDeployment);
apiRouter.get('/deploy/:deploymentId/health', checkDeploymentHealth);
apiRouter.get('/deploy/history', listDeployments);
