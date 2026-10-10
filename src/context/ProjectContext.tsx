import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteProject, WebsiteSection, SectionType, WebsiteCategory, ColorPalette } from '../types';
import { STARTER_TEMPLATES } from '../data/templates';
import { generateWebsiteFromPrompt, refineSectionWithChat } from '../services/aiService';
import { saveProjectToBackend, fetchProjectsFromBackend, deleteProjectFromBackend } from '../services/apiClient';

interface GenerationProgress {
  step: number;
  total: number;
  message: string;
}

interface ProjectContextType {
  projects: WebsiteProject[];
  activeProject: WebsiteProject;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
  setActiveDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  isGenerating: boolean;
  generationProgress: GenerationProgress | null;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  setActiveProject: (project: WebsiteProject) => void;
  updateActiveProject: (partial: Partial<WebsiteProject>) => void;
  saveCurrentProject: () => void;
  createNewProject: (category?: WebsiteCategory, prompt?: string) => Promise<WebsiteProject>;
  generateProject: (prompt: string, category: WebsiteCategory, style?: string) => Promise<void>;
  updateSection: (sectionId: string, updatedSection: Partial<WebsiteSection>) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  reorderSections: (dragIndex: number, hoverIndex: number) => void;
  addSection: (type: SectionType) => void;
  removeSection: (sectionId: string) => void;
  refineSectionAi: (sectionId: string, instruction: string) => string;
  loadTemplate: (templateId: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
}

const DEFAULT_PROJECT: WebsiteProject = {
  id: 'proj-apex-initial',
  name: STARTER_TEMPLATES[0].defaultProject.name || 'Apex AI Intelligence',
  category: (STARTER_TEMPLATES[0].defaultProject.category || 'saas') as WebsiteCategory,
  style: (STARTER_TEMPLATES[0].defaultProject.style || 'modern-minimal') as any,
  palette: STARTER_TEMPLATES[0].defaultProject.palette as ColorPalette,
  fontFamily: 'Inter',
  sections: (STARTER_TEMPLATES[0].defaultProject.sections || []) as WebsiteSection[],
  prompt: STARTER_TEMPLATES[0].defaultProject.prompt || 'Predictive AI Analytics Platform with clean white cards and features',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  qualityScore: 96,
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<WebsiteProject[]>(() => {
    try {
      const saved = localStorage.getItem('sitegen_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    // Seed with initial template projects
    return [
      DEFAULT_PROJECT,
      {
        ...DEFAULT_PROJECT,
        id: 'proj-portfolio-seed',
        name: STARTER_TEMPLATES[1].defaultProject.name || 'Elena Vance Design',
        category: 'portfolio',
        palette: STARTER_TEMPLATES[1].defaultProject.palette as ColorPalette,
        sections: STARTER_TEMPLATES[1].defaultProject.sections as WebsiteSection[],
        prompt: STARTER_TEMPLATES[1].defaultProject.prompt || '',
      },
      {
        ...DEFAULT_PROJECT,
        id: 'proj-bistro-seed',
        name: STARTER_TEMPLATES[2].defaultProject.name || 'Bella Roma',
        category: 'restaurant',
        palette: STARTER_TEMPLATES[2].defaultProject.palette as ColorPalette,
        sections: STARTER_TEMPLATES[2].defaultProject.sections as WebsiteSection[],
        prompt: STARTER_TEMPLATES[2].defaultProject.prompt || '',
      },
    ];
  });

  const [activeProject, setActiveProjectState] = useState<WebsiteProject>(() => {
    return projects[0] || DEFAULT_PROJECT;
  });

  const [undoStack, setUndoStack] = useState<WebsiteProject[]>([]);
  const [redoStack, setRedoStack] = useState<WebsiteProject[]>([]);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sitegen_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to sync projects to localStorage', e);
    }
  }, [projects]);

  const pushToUndo = (current: WebsiteProject) => {
    setUndoStack((prev) => [...prev.slice(-15), JSON.parse(JSON.stringify(current))]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(activeProject))]);
    setUndoStack((prev) => prev.slice(0, -1));
    setActiveProjectState(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(activeProject))]);
    setRedoStack((prev) => prev.slice(0, -1));
    setActiveProjectState(next);
  };

  const setActiveProject = (proj: WebsiteProject) => {
    pushToUndo(activeProject);
    setActiveProjectState(proj);
  };

  const updateActiveProject = (partial: Partial<WebsiteProject>) => {
    pushToUndo(activeProject);
    const updated = {
      ...activeProject,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    setActiveProjectState(updated);
    // Also update in projects list if exists
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const saveCurrentProject = () => {
    const updated = { ...activeProject, updatedAt: new Date().toISOString() };
    setActiveProjectState(updated);
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      if (exists) {
        return prev.map((p) => (p.id === updated.id ? updated : p));
      }
      return [updated, ...prev];
    });

    // Also persist asynchronously to Express backend / MongoDB Atlas
    saveProjectToBackend(updated).catch((err) => {
      console.warn('Backend MongoDB autosave not active or unreachable:', err.message);
    });
  };

  const updateSection = (sectionId: string, updatedFields: Partial<WebsiteSection>) => {
    pushToUndo(activeProject);
    const updatedSections = activeProject.sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          ...updatedFields,
          content: { ...sec.content, ...(updatedFields.content || {}) },
          styles: { ...sec.styles, ...(updatedFields.styles || {}) },
        };
      }
      return sec;
    });
    updateActiveProject({ sections: updatedSections });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    pushToUndo(activeProject);
    const updatedSections = activeProject.sections.map((sec) => {
      if (sec.id === sectionId) {
        return { ...sec, isVisible: !sec.isVisible };
      }
      return sec;
    });
    updateActiveProject({ sections: updatedSections });
  };

  const reorderSections = (dragIndex: number, hoverIndex: number) => {
    pushToUndo(activeProject);
    const updated = [...activeProject.sections];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, moved);
    updateActiveProject({ sections: updated });
  };

  const addSection = (type: SectionType) => {
    pushToUndo(activeProject);
    const newSection: WebsiteSection = {
      id: 'sec-' + type + '-' + Date.now(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1) + ' Section',
      isVisible: true,
      content: {
        headline: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Header`,
        subheadline: 'Crafted with SiteGen AI section generator.',
        primaryCtaText: 'Learn More',
        primaryCtaUrl: '#',
      },
    };
    // Insert before footer if exists, or append at end
    const footerIdx = activeProject.sections.findIndex((s) => s.type === 'footer');
    const updated = [...activeProject.sections];
    if (footerIdx !== -1) {
      updated.splice(footerIdx, 0, newSection);
    } else {
      updated.push(newSection);
    }
    updateActiveProject({ sections: updated });
  };

  const removeSection = (sectionId: string) => {
    pushToUndo(activeProject);
    const updated = activeProject.sections.filter((s) => s.id !== sectionId);
    updateActiveProject({ sections: updated });
  };

  const refineSectionAi = (sectionId: string, instruction: string): string => {
    const sec = activeProject.sections.find((s) => s.id === sectionId);
    if (!sec) return 'Section not found.';
    pushToUndo(activeProject);
    const { updatedSection, changeSummary } = refineSectionWithChat(sec, instruction);
    const updatedSections = activeProject.sections.map((s) => (s.id === sectionId ? updatedSection : s));
    updateActiveProject({ sections: updatedSections });
    return changeSummary;
  };

  const generateProject = async (
    prompt: string,
    category: WebsiteCategory,
    style: string = 'modern-minimal'
  ) => {
    setIsGenerating(true);
    try {
      const result = await generateWebsiteFromPrompt(
        prompt,
        category,
        (step, total, message) => {
          setGenerationProgress({ step, total, message });
        },
        undefined,
        style
      );
      pushToUndo(activeProject);
      setActiveProjectState(result.project);
      setProjects((prev) => [result.project, ...prev.filter((p) => p.id !== result.project.id)]);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const createNewProject = async (
    category: WebsiteCategory = 'saas',
    prompt: string = 'A modern clean responsive landing page'
  ): Promise<WebsiteProject> => {
    const result = await generateWebsiteFromPrompt(prompt, category);
    pushToUndo(activeProject);
    setActiveProjectState(result.project);
    setProjects((prev) => [result.project, ...prev]);
    return result.project;
  };

  const loadTemplate = (templateId: string) => {
    const found = STARTER_TEMPLATES.find((t) => t.id === templateId);
    if (!found) return;
    pushToUndo(activeProject);
    const newProj: WebsiteProject = {
      id: 'proj-' + found.id + '-' + Date.now().toString(36),
      name: found.defaultProject.name || found.title,
      category: (found.defaultProject.category || found.category) as WebsiteCategory,
      style: (found.defaultProject.style || 'futuristic-dark') as any,
      palette: found.defaultProject.palette as ColorPalette,
      fontFamily: (found.defaultProject.fontFamily || 'Inter') as any,
      sections: JSON.parse(JSON.stringify(found.defaultProject.sections || [])),
      prompt: found.defaultProject.prompt || found.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qualityScore: 98,
    };
    setActiveProjectState(newProj);
    setProjects((prev) => [newProj, ...prev]);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      if (activeProject.id === id && remaining.length > 0) {
        setActiveProjectState(remaining[0]);
      }
      return remaining;
    });

    deleteProjectFromBackend(id).catch((err) => {
      console.warn('Backend project delete sync omitted:', err.message);
    });
  };

  const duplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const duplicated: WebsiteProject = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
    setActiveProjectState(duplicated);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeDevice,
        setActiveDevice,
        isGenerating,
        generationProgress,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        undo,
        redo,
        setActiveProject,
        updateActiveProject,
        saveCurrentProject,
        createNewProject,
        generateProject,
        updateSection,
        toggleSectionVisibility,
        reorderSections,
        addSection,
        removeSection,
        refineSectionAi,
        loadTemplate,
        deleteProject,
        duplicateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
};
