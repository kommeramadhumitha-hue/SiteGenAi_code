import { RequirementAgent } from './requirementAgent.js';
import { PlanningAgent } from './planningAgent.js';
import { GenerationAgent } from './generationAgent.js';
import { ValidationAgent } from './validationAgent.js';
import { RepairAgent } from './repairAgent.js';
import { ExplanationAgent } from './explanationAgent.js';

export class AgentOrchestrator {
  constructor(aiProvider) {
    this.provider = aiProvider;
    this.requirementAgent = new RequirementAgent(aiProvider);
    this.planningAgent = new PlanningAgent(aiProvider);
    this.generationAgent = new GenerationAgent(aiProvider);
    this.validationAgent = new ValidationAgent();
    this.repairAgent = new RepairAgent();
    this.explanationAgent = new ExplanationAgent();
  }

  async runPipeline({ prompt, category = 'saas', style = 'futuristic-dark', language = 'en' }) {
    const startTime = Date.now();
    const agentLogs = [];

    // Stage 1: Requirement Analysis
    const reqStart = Date.now();
    const requirements = await this.requirementAgent.analyze(prompt, category, language);
    agentLogs.push({
      agent: 'Requirement Agent',
      durationMs: Date.now() - reqStart,
      status: 'completed',
      summary: `Parsed intent for ${requirements.category} platform in ${requirements.language.toUpperCase()}`,
    });

    // Stage 2: Architecture Planning
    const planStart = Date.now();
    const plan = this.planningAgent.plan(requirements, style);
    agentLogs.push({
      agent: 'Planning Agent',
      durationMs: Date.now() - planStart,
      status: 'completed',
      summary: `Structured ${plan.sectionPlan.length} sections, ${plan.palette.name} palette, and ${plan.fontFamily} font`,
    });

    // Stage 3: Generation
    const genStart = Date.now();
    const rawProject = await this.generationAgent.generate(requirements, plan);
    agentLogs.push({
      agent: 'Generation Agent',
      durationMs: Date.now() - genStart,
      status: 'completed',
      summary: `Synthesized semantic sections with copy and layout tokens`,
    });

    // Stage 4: Validation
    const valStart = Date.now();
    const validationResult = this.validationAgent.validate(rawProject);
    agentLogs.push({
      agent: 'Validation Agent',
      durationMs: Date.now() - valStart,
      status: validationResult.isValid ? 'passed' : 'flagged',
      summary: validationResult.isValid
        ? 'Schema and structure passed WCAG & Zod verification'
        : `Identified ${validationResult.issues.length} deviations requiring correction`,
    });

    // Stage 5: Repair
    const repStart = Date.now();
    const { repairedProject, repairsApplied } = this.repairAgent.repair(
      validationResult.sanitizedProject,
      validationResult.issues
    );
    agentLogs.push({
      agent: 'Repair Agent',
      durationMs: Date.now() - repStart,
      status: 'completed',
      summary:
        repairsApplied.length > 0
          ? `Applied ${repairsApplied.length} structural safeguards`
          : 'Project pristine; no repairs needed',
    });

    // Stage 6: Explanation
    const expStart = Date.now();
    const explanation = this.explanationAgent.explain(repairedProject, requirements, repairsApplied);
    agentLogs.push({
      agent: 'Explanation Agent',
      durationMs: Date.now() - expStart,
      status: 'completed',
      summary: 'Generated user summary and next action checklist',
    });

    return {
      project: repairedProject,
      agentLogs,
      explanation,
      executionTimeMs: Date.now() - startTime,
    };
  }
}
