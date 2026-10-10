import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Layers,
  Palette,
  Type,
  ChevronDown,
  ArrowRight,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { WebsiteCategory, WebsiteStyle } from '../../types';
import { PALETTE_PRESETS } from '../../services/aiService';
import { useSettings } from '../../context/SettingsContext';

interface PromptBarProps {
  onGenerate: (prompt: string, category: WebsiteCategory, style?: WebsiteStyle) => void;
  isGenerating: boolean;
  progressMessage?: string;
  progressStep?: number;
  totalSteps?: number;
  initialPrompt?: string;
  initialCategory?: WebsiteCategory;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  onGenerate,
  isGenerating,
  progressMessage,
  progressStep = 1,
  totalSteps = 5,
  initialPrompt,
  initialCategory,
}) => {
  const { t } = useSettings();
  const [promptText, setPromptText] = useState(
    initialPrompt ||
    'A high-converting SaaS landing page for an AI developer copilot with clean white aesthetic, feature cards, and interactive testimonials.'
  );
  const [category, setCategory] = useState<WebsiteCategory>(initialCategory || 'saas');
  const [style, setStyle] = useState<WebsiteStyle>('modern-minimal');

  React.useEffect(() => {
    if (initialPrompt && initialPrompt !== promptText) {
      setPromptText(initialPrompt);
    }
  }, [initialPrompt]);

  React.useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories: { value: WebsiteCategory; label: string }[] = [
    { value: 'saas', label: 'SaaS Platform' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'business', label: 'Business / Corporate' },
    { value: 'landing', label: 'Landing Page' },
    { value: 'restaurant', label: 'Restaurant & Dining' },
    { value: 'agency', label: 'Agency & Studio' },
    { value: 'education', label: 'Education / EdTech' },
    { value: 'ecommerce', label: 'E-Commerce Storefront' },
    { value: 'blog', label: 'Blog & Editorial' },
    { value: 'documentation', label: 'Documentation Hub' },
    { value: 'custom', label: 'Custom App' },
  ];

  const samplePrompts = [
    'AI analytics engine with clean white cards, customer testimonials, and contact form.',
    'Elena Vance UX designer portfolio with project case studies and contact form.',
    'Authentic Roman Italian trattoria with woodfired pizza specials and table reservation.',
    'Audiophile wireless headphones hardware store with tech specs and buy button.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim() && !isGenerating) {
      onGenerate(promptText.trim(), category, style);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Category and Style Selectors */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 font-medium">{t.generator.selectCategory}:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as WebsiteCategory)}
            className="bg-transparent text-slate-900 font-semibold outline-none cursor-pointer pr-1"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} className="bg-white text-slate-900">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 font-medium">{t.generator.selectStyle}:</span>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as WebsiteStyle)}
            className="bg-transparent text-slate-900 font-semibold outline-none cursor-pointer pr-1"
          >
            <option value="modern-minimal" className="bg-white">Modern Minimal (Clean White)</option>
            <option value="corporate-clean" className="bg-white">Corporate Clean</option>
            <option value="warm-editorial" className="bg-white">Warm Editorial</option>
            <option value="vibrant-gradient" className="bg-white">Subtle Accent</option>
            <option value="futuristic-dark" className="bg-white">Futuristic Dark</option>
          </select>
        </div>
      </div>

      {/* Main Prompt Textarea */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isGenerating}
            rows={3}
            placeholder={t.landing.promptPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none transition-all leading-relaxed"
          />
        </div>

        {/* Example prompts chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Try:</span>
          </div>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPromptText(sp);
                if (sp.includes('Italian') || sp.includes('trattoria')) setCategory('restaurant');
                else if (sp.includes('portfolio') || sp.includes('Vance')) setCategory('portfolio');
                else if (sp.includes('hardware') || sp.includes('headphones')) setCategory('ecommerce');
                else setCategory('saas');
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors truncate max-w-[240px]"
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Generate Button & Progress */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {isGenerating ? (
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-700 font-semibold flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {progressMessage || 'Synthesizing website...'}
                </span>
                <span className="text-slate-500 text-[11px] font-mono">
                  Step {progressStep} of {totalSteps}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-700 transition-all duration-300"
                  style={{ width: `${(progressStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>Full semantic HTML5 sections generated in seconds.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating || !promptText.trim()}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all flex-shrink-0 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.common.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Website</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
