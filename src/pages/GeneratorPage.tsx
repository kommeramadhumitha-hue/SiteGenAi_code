import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Layers,
  Bot,
  Sparkles,
  Maximize2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { PromptBar } from '../components/generator/PromptBar';
import { SectionList } from '../components/generator/SectionList';
import { ChatAssistantDrawer } from '../components/generator/ChatAssistantDrawer';
import { SandboxedPreview } from '../components/preview/SandboxedPreview';
import { useProject } from '../context/ProjectContext';
import { WebsiteCategory, SectionType } from '../types';

export const GeneratorPage: React.FC = () => {
  const location = useLocation();
  const {
    activeProject,
    activeDevice,
    isGenerating,
    generationProgress,
    generateProject,
    updateSection,
    toggleSectionVisibility,
    reorderSections,
    addSection,
    removeSection,
    refineSectionAi,
  } = useProject();

  const [activeLeftTab, setActiveLeftTab] = useState<'outline' | 'copilot'>('outline');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('preview');
  const [showPromptBar, setShowPromptBar] = useState(true);

  // Auto-switch to preview tab on mobile whenever generation finishes or is in progress
  useEffect(() => {
    if (isGenerating) {
      setMobileTab('preview');
    }
  }, [isGenerating]);

  // Read location state passed from LandingPage or templates
  const statePrompt = (location.state as any)?.prompt || activeProject?.prompt;
  const stateCategory = (location.state as any)?.category || activeProject?.category;
  const shouldAutoGenerate = (location.state as any)?.autoGenerate;

  const autoGenerateTriggeredRef = React.useRef(false);

  useEffect(() => {
    if (shouldAutoGenerate && !autoGenerateTriggeredRef.current && statePrompt) {
      autoGenerateTriggeredRef.current = true;
      setMobileTab('preview');
      generateProject(statePrompt, stateCategory || 'saas');
    }
  }, [shouldAutoGenerate, statePrompt, stateCategory, generateProject]);

  const handleGenerate = async (prompt: string, category: WebsiteCategory, style?: any) => {
    setMobileTab('preview');
    await generateProject(prompt, category, style || 'modern-minimal');
  };

  return (
    <div className="space-y-3.5 flex flex-col h-[calc(100vh-6rem)]">
      {/* Top Prompt Section (Studio Composer) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI Generation Studio
            </h2>
          </div>
          <button
            onClick={() => setShowPromptBar(!showPromptBar)}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 transition-colors font-semibold cursor-pointer"
          >
            <span>{showPromptBar ? 'Hide Composer' : 'Show Composer'}</span>
            {showPromptBar ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showPromptBar && (
          <PromptBar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            progressMessage={generationProgress?.message}
            progressStep={generationProgress?.step}
            totalSteps={generationProgress?.total}
            initialPrompt={statePrompt}
            initialCategory={stateCategory}
          />
        )}
      </div>

      {/* Mobile Switcher (Visible only on small/medium screens < lg) */}
      <div className="flex lg:hidden bg-slate-200/70 p-1 rounded-xl border border-slate-300">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'editor'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Structure & Copilot
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'preview'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Main Workspace Grid (Left: Outline/Copilot, Right: Live Sandboxed Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: Outline or AI Copilot */}
        <div className={`lg:col-span-5 xl:col-span-4 flex flex-col h-full min-h-0 space-y-2 ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Tabs */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs flex-shrink-0">
            <button
              onClick={() => setActiveLeftTab('outline')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === 'outline'
                  ? 'bg-slate-100 text-blue-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>Section Outline</span>
            </button>
            <button
              onClick={() => setActiveLeftTab('copilot')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === 'copilot'
                  ? 'bg-slate-100 text-blue-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-blue-700" />
              <span>AI Copilot Chat</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1 min-h-0 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xs">
            {activeLeftTab === 'outline' ? (
              <SectionList
                sections={activeProject.sections}
                onToggleVisibility={toggleSectionVisibility}
                onReorder={reorderSections}
                onUpdateSection={updateSection}
                onRemoveSection={removeSection}
                onAddSection={addSection}
                onRefineSectionAi={refineSectionAi}
              />
            ) : (
              <ChatAssistantDrawer />
            )}
          </div>
        </div>

        {/* Right Column: Live Sandboxed Preview */}
        <div className={`lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-0 ${mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <SandboxedPreview
            project={activeProject}
            activeDevice={activeDevice}
            isLoading={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};
