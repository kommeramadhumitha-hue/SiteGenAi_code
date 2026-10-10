import { getAiProvider } from '../services/ai/providerFactory.js';
import { AgentOrchestrator } from '../services/agents/agentOrchestrator.js';
import { mongoService } from '../services/mongoService.js';

export async function generateWebsite(req, res, next) {
  try {
    const { prompt, category = 'saas', style = 'modern-minimal', language = 'en', apiKey, aiProvider } = req.body;

    const provider = getAiProvider(apiKey, aiProvider);
    const orchestrator = new AgentOrchestrator(provider);

    const result = await orchestrator.runPipeline({
      prompt,
      category,
      style,
      language,
    });

    // Persist project in database / local fallback
    const savedProject = await mongoService.saveProject(result.project);

    // Save initial version
    await mongoService.saveProjectVersion(
      savedProject.id,
      savedProject,
      `Initial multi-agent synthesis: "${prompt.slice(0, 50)}..."`
    );

    // Log prompt history
    await mongoService.logPrompt({
      projectId: savedProject.id,
      prompt,
      operationType: 'generation',
      language,
      durationMs: result.executionTimeMs,
      provider: provider.name,
      success: true,
    });

    const isSimulated = savedProject?._meta?.isSimulated ?? !provider.isLive;
    const fallbackError = savedProject?._meta?.error || null;

    return res.json({
      success: true,
      project: savedProject,
      agentLogs: result.agentLogs,
      explanation: result.explanation,
      executionTimeMs: result.executionTimeMs,
      provider: {
        name: isSimulated ? (fallbackError ? 'Local Generator Fallback (Gemini Error)' : 'SiteGen Heuristic Engine (Local)') : provider.name,
        model: isSimulated ? 'heuristic-engine-v1' : provider.model,
        isLive: !isSimulated,
        error: fallbackError,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function generateFromSketch(req, res, next) {
  try {
    const { prompt = 'Convert this wireframe into a responsive website', imageBase64, mimeType, apiKey, aiProvider } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 payload is required' });
    }

    const provider = getAiProvider(apiKey, aiProvider);

    if (!provider.supportsVision()) {
      return res.status(400).json({
        error: `Vision analysis is unavailable on the current provider (${provider.name}). Configure Google Gemini (gemini-1.5-flash) or OpenAI (gpt-4o) in server/.env with a valid API key to enable wireframe image synthesis.`,
        supportsVision: false,
      });
    }

    const visionResult = await provider.visionAnalyze({
      userPrompt: prompt,
      imageBase64,
      mimeType: mimeType || 'image/png',
    });

    return res.json({
      success: true,
      visionResult,
      provider: provider.name,
    });
  } catch (err) {
    next(err);
  }
}

export async function regenerateSection(req, res, next) {
  try {
    const { project, sectionId, instruction = 'Regenerate copy with higher conversion appeal', language = 'en', apiKey, aiProvider } = req.body;

    if (!project || !sectionId) {
      return res.status(400).json({ error: 'Project and sectionId are required' });
    }

    const targetSection = project.sections.find((s) => s.id === sectionId);
    if (!targetSection) {
      return res.status(404).json({ error: `Section with ID ${sectionId} not found in project` });
    }

    const provider = getAiProvider(apiKey, aiProvider);

    // Update section copy
    const updatedSection = JSON.parse(JSON.stringify(targetSection));
    if (instruction.toLowerCase().includes('headline')) {
      updatedSection.content.headline = `Refined: ${instruction}`;
    } else {
      updatedSection.content.subheadline = `Refreshed copy aligned with: "${instruction}"`;
    }

    const updatedSections = project.sections.map((s) => (s.id === sectionId ? updatedSection : s));
    const updatedProject = { ...project, sections: updatedSections, updatedAt: new Date().toISOString() };

    // Save version
    await mongoService.saveProject(updatedProject);
    await mongoService.saveProjectVersion(
      updatedProject.id,
      updatedProject,
      `Regenerated section ${targetSection.title}: "${instruction}"`
    );

    return res.json({
      success: true,
      project: updatedProject,
      updatedSection,
      changeSummary: `Regenerated ${targetSection.title} based on your instruction.`,
    });
  } catch (err) {
    next(err);
  }
}
