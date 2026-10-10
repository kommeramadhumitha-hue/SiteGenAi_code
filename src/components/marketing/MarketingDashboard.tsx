import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Share2,
  Megaphone,
  Gauge,
  Copy,
  Check,
  Edit3,
  Download,
  Calendar,
  Instagram,
  Facebook,
  ExternalLink,
  Target,
  DollarSign,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Layers,
  ArrowRight,
  Info,
  Sliders,
  Globe,
  Link2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useSettings } from '../../context/SettingsContext';
import { fetchMarketingStrategy } from '../../services/apiClient';
import { auditProjectMarketing } from '../../services/marketingService';
import { MarketingStrategy } from '../../types';

export const MarketingDashboard: React.FC = () => {
  const { activeProject } = useProject();
  const { language } = useSettings();

  const [activeTab, setActiveTab] = useState<'strategy' | 'seo' | 'social' | 'ads' | 'score'>('strategy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<MarketingStrategy | null>(null);
  const [targetAudienceInput, setTargetAudienceInput] = useState('');
  const [keyBenefitsInput, setKeyBenefitsInput] = useState('');
  const [websiteUrlInput, setWebsiteUrlInput] = useState(
    `https://${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sitegen.preview`
  );
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Edit modal / inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<'seo' | 'instagram' | 'facebook' | 'googleAds' | 'metaAds' | null>(null);
  const [editableText, setEditableText] = useState('');

  // Client-side marketing score audit for current active project
  const marketingAudit = useMemo(() => {
    return auditProjectMarketing(activeProject);
  }, [activeProject]);

  const handleGenerateStrategy = async () => {
    setIsGenerating(true);
    try {
      const res = await fetchMarketingStrategy({
        projectName: activeProject.name,
        category: activeProject.category,
        targetAudience: targetAudienceInput || undefined,
        keyBenefits: keyBenefitsInput || undefined,
        websiteUrl: websiteUrlInput.trim() || `https://${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sitegen.preview`,
        language,
        projectContext: {
          style: activeProject.style,
          sectionsCount: activeProject.sections.length,
          sectionTypes: activeProject.sections.map((s) => s.type),
        },
      });

      if (res.strategy) {
        setStrategy(res.strategy);
      }
    } catch (err: any) {
      console.error('Marketing strategy generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  const handleExportJson = () => {
    if (!strategy) return;
    const blob = new Blob([JSON.stringify(strategy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-marketing-strategy.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openEditor = (section: 'seo' | 'instagram' | 'facebook' | 'googleAds' | 'metaAds', text: string) => {
    setEditSection(section);
    setEditableText(text);
    setIsEditing(true);
  };

  const saveEditedText = () => {
    if (!strategy || !editSection) return;
    const updated = JSON.parse(JSON.stringify(strategy));

    if (editSection === 'seo') {
      updated.seo.metaDescription = editableText;
    } else if (editSection === 'instagram') {
      updated.socialMedia.instagram.postText = editableText;
    } else if (editSection === 'facebook') {
      updated.socialMedia.facebook.postText = editableText;
    } else if (editSection === 'metaAds') {
      updated.paidAdvertising.metaAds.primaryCopy = editableText;
    }

    setStrategy(updated);
    setIsEditing(false);
    setEditSection(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Marketing Assistant</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Powered by Google Gemini</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Marketing & Growth Strategy Studio
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Synthesize optimized SEO metadata, social media content calendars, paid ad campaign blueprints, and audit your website's conversion readiness for <strong className="text-slate-900">{activeProject.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {strategy && (
            <button
              onClick={handleExportJson}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export Strategy</span>
            </button>
          )}

          <button
            onClick={handleGenerateStrategy}
            disabled={isGenerating}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{strategy ? 'Regenerate Strategy' : 'Generate Full Marketing Plan'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Customizer Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Strategy Formulation & URL Analysis Inputs
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Paste any live URL or custom domain</span>
        </div>

        {/* Website URL Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target Website URL</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) setWebsiteUrlInput(text.trim());
                  } catch {
                    // clipboard read failed
                  }
                }}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition cursor-pointer"
              >
                Paste URL from Clipboard
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() =>
                  setWebsiteUrlInput(
                    `https://${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sitegen.preview`
                  )
                }
                className="text-[11px] text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Reset to Project URL
              </button>
            </div>
          </div>
          <div className="relative flex items-center">
            <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="url"
              value={websiteUrlInput}
              onChange={(e) => setWebsiteUrlInput(e.target.value)}
              placeholder="e.g. https://mybrand.com or https://stripe.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            The AI Marketing Assistant will analyze this website address, tailor meta tags, build your 7-day social calendar, and generate Google/Meta ad copies targeted specifically to this domain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudienceInput}
              onChange={(e) => setTargetAudienceInput(e.target.value)}
              placeholder="e.g. Remote software teams, foodies seeking artisan pizza, seed-stage founders"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Key UVP / Core Benefits
            </label>
            <input
              type="text"
              value={keyBenefitsInput}
              onChange={(e) => setKeyBenefitsInput(e.target.value)}
              placeholder="e.g. 10x faster workflow, organic sourdough crust, zero lock-in pricing"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Navigation Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        {[
          { id: 'strategy', label: 'Overview & Strategy', icon: Target },
          { id: 'seo', label: 'SEO & Metadata', icon: Search },
          { id: 'social', label: 'Social & 7-Day Calendar', icon: Share2 },
          { id: 'ads', label: 'Google & Meta Ads Guidance', icon: Megaphone },
          { id: 'score', label: 'Website Marketing Score', icon: Gauge },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notification Toast */}
      {copySuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Copied {copySuccess} to clipboard!</span>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Edit Content Before Copying / Export</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              rows={8}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedText}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TABS */}

      {/* 1. STRATEGY OVERVIEW */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          {!strategy ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Marketing Strategy Generated Yet</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Click <strong>"Generate Full Marketing Plan"</strong> above to synthesize your end-to-end SEO metadata, social calendars, Google & Meta ads, and readiness checks using Google Gemini.
              </p>
              <button
                onClick={handleGenerateStrategy}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Strategy Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Brand Identity</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                    {activeProject.category}
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900">{activeProject.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 font-mono truncate bg-indigo-50/70 px-2.5 py-1 rounded-lg border border-indigo-100">
                  <Globe className="w-3 h-3 flex-shrink-0" />
                  <a
                    href={websiteUrlInput.startsWith('http') ? websiteUrlInput : `https://${websiteUrlInput}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline"
                  >
                    {websiteUrlInput}
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {strategy.seo.metaDescription}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Sections: {activeProject.sections.length}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Marketing Score: {strategy.marketingScore.overallScore}/100
                  </span>
                </div>
              </div>

              {/* Quick Keywords Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Top Target Keywords</div>
                <div className="flex flex-wrap gap-1.5">
                  {strategy.seo.primaryKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-semibold"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Optimized for organic search intent and Google ranking visibility.
                </p>
              </div>

              {/* Quick Ads Overview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Ad Campaign Blueprints</div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Google Ads Budget:</span>
                    <span className="font-mono text-indigo-600 font-bold">{strategy.paidAdvertising.googleAds.suggestedDailyBudget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Meta Ads Budget:</span>
                    <span className="font-mono text-indigo-600 font-bold">{strategy.paidAdvertising.metaAds.suggestedDailyBudget}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab('ads')}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Full Campaign Setup</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SEO & METADATA */}
      {activeTab === 'seo' && strategy && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta Title & Description Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-indigo-600" />
                  <span>Search Engine SERP Preview</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Google Snippet
                </span>
              </div>

              {/* Google Result Preview Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 text-left font-sans">
                <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <span>https://preview.sitegen.ai</span>
                  <span>›</span>
                  <span className="text-slate-700 font-semibold">{activeProject.category}</span>
                </div>
                <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                  {strategy.seo.title}
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  {strategy.seo.metaDescription}
                </div>
              </div>

              {/* Copy / Edit Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleCopyText(strategy.seo.title, 'Meta Title')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Title</span>
                </button>
                <button
                  onClick={() => handleCopyText(strategy.seo.metaDescription, 'Meta Description')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Description</span>
                </button>
                <button
                  onClick={() => openEditor('seo', strategy.seo.metaDescription)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Keyword Strategy Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Primary & Secondary Keywords</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Primary Ranking Targets
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.seo.primaryKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Secondary Long-Tail Keywords
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {strategy.seo.secondaryKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Suggestions Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Strategic Content Suggestions & High-Converting Articles</span>
              </h3>
              <span className="text-xs text-slate-500">SEO Organic Growth</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {strategy.seo.contentSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                        {item.format}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{item.targetIntent}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">{item.topic}</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.outline}</p>
                  </div>
                  <button
                    onClick={() => handleCopyText(`${item.topic}\n\nOutline: ${item.outline}`, item.topic)}
                    className="self-start text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 pt-2 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Topic Outline</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SOCIAL MEDIA & CONTENT CALENDAR */}
      {activeTab === 'social' && strategy && (
        <div className="space-y-6">
          {/* Instagram & Facebook Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instagram Post Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Instagram Post & Visual Concept</h4>
                    <span className="text-[10px] text-slate-500">Feed Post + Caption</span>
                  </div>
                </div>
                <button
                  onClick={() => openEditor('instagram', strategy.socialMedia.instagram.postText)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {strategy.socialMedia.instagram.postText}
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-indigo-900">Recommended Image Concept:</div>
                <div className="text-xs text-indigo-800 leading-relaxed">{strategy.socialMedia.instagram.imageIdea}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {strategy.socialMedia.instagram.hashtags.map((tag, i) => (
                  <span key={i} className="text-[11px] text-indigo-600 font-mono font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleCopyText(strategy.socialMedia.instagram.postText, 'Instagram Post')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Instagram Caption</span>
              </button>
            </div>

            {/* Facebook Post Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Facebook Community Post</h4>
                    <span className="text-[10px] text-slate-500">Engagement & Link Click</span>
                  </div>
                </div>
                <button
                  onClick={() => openEditor('facebook', strategy.socialMedia.facebook.postText)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {strategy.socialMedia.facebook.postText}
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-blue-900">Suggested Action Button:</div>
                <div className="text-xs text-blue-800 font-semibold">{strategy.socialMedia.facebook.callToAction}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {strategy.socialMedia.facebook.hashtags.map((tag, i) => (
                  <span key={i} className="text-[11px] text-blue-600 font-mono font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleCopyText(strategy.socialMedia.facebook.postText, 'Facebook Post')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Facebook Post</span>
              </button>
            </div>
          </div>

          {/* 7-Day Social Calendar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">7-Day Social Media Content Calendar</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">Multi-Channel Consistency</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {strategy.socialMedia.contentCalendar.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      {item.day}
                    </span>
                    <div className="text-xs font-bold text-slate-900">{item.theme}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{item.platform}</div>
                    <p className="text-[11px] text-slate-600 leading-snug pt-1">{item.caption}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                    <span className="font-medium text-slate-700">{item.assetType}</span>
                    <span className="font-mono text-indigo-600">{item.suggestedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. GOOGLE & META ADS GUIDANCE */}
      {activeTab === 'ads' && strategy && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Ads Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Google Search Ads Guidance</h4>
                    <span className="text-[10px] text-slate-500">Responsive Search Ads (RSA)</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                  {strategy.paidAdvertising.googleAds.suggestedDailyBudget}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Recommended Headlines (up to 30 chars each)
                  </div>
                  <div className="space-y-1">
                    {strategy.paidAdvertising.googleAds.headlines.map((hl, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      >
                        <span className="font-medium">{hl}</span>
                        <button
                          onClick={() => handleCopyText(hl, `Headline ${i + 1}`)}
                          className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Ad Descriptions (up to 90 chars each)
                  </div>
                  <div className="space-y-1">
                    {strategy.paidAdvertising.googleAds.descriptions.map((desc, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start justify-between gap-2"
                      >
                        <span>{desc}</span>
                        <button
                          onClick={() => handleCopyText(desc, `Description ${i + 1}`)}
                          className="text-slate-400 hover:text-indigo-600 cursor-pointer flex-shrink-0"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Objective: <strong className="text-slate-900">{strategy.paidAdvertising.googleAds.campaignObjective}</strong></span>
              </div>
            </div>

            {/* Meta Ads Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Meta Ads (Facebook & Instagram)</h4>
                    <span className="text-[10px] text-slate-500">Feed & Reels Advantage+</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                  {strategy.paidAdvertising.metaAds.suggestedDailyBudget}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Primary Ad Copy</span>
                    <button
                      onClick={() => openEditor('metaAds', strategy.paidAdvertising.metaAds.primaryCopy)}
                      className="text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {strategy.paidAdvertising.metaAds.primaryCopy}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Target Audience Definition
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Demographics:</strong> {strategy.paidAdvertising.metaAds.targetAudience.demographics}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Target Interests:</strong> {strategy.paidAdvertising.metaAds.targetAudience.interests.join(', ')}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Behaviors:</strong> {strategy.paidAdvertising.metaAds.targetAudience.behaviors}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Objective: <strong className="text-slate-900">{strategy.paidAdvertising.metaAds.campaignObjective}</strong></span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Ad Integration Guidance:</strong> SiteGen AI prepares production-ready ad creative copy and budget allocations. We do not automatically charge your ad account or post unapproved ads to third-party ad networks without explicit account authorization.
            </div>
          </div>
        </div>
      )}

      {/* 5. WEBSITE MARKETING SCORE */}
      {activeTab === 'score' && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Conversion Readiness</span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Website Marketing & Conversion Score
              </h3>
              <p className="text-xs text-slate-600 max-w-xl">
                Real DOM structural audit evaluating search indexing visibility, mobile fluid layout, call-to-action density, and lead capture contact channels.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="text-3xl font-black text-indigo-600">{marketingAudit.score}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score / 100</span>
              </div>
            </div>
          </div>

          {/* Breakdown 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'SEO & Headlines', score: marketingAudit.breakdown.seo, desc: 'Search engine readability and title relevance' },
              { label: 'Mobile Fluidity', score: marketingAudit.breakdown.responsiveness, desc: 'Responsive navigation and container layout' },
              { label: 'Calls to Action (CTA)', score: marketingAudit.breakdown.callsToAction, desc: 'Conversion triggers and action buttons' },
              { label: 'Contact & Inquiry', score: marketingAudit.breakdown.contactDetails, desc: 'Lead capture forms and contact links' },
            ].map((metric, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{metric.label}</span>
                  <span className="text-sm font-black text-indigo-600">{metric.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{metric.desc}</p>
              </div>
            ))}
          </div>

          {/* Detailed Verification Checks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Conversion Auditing Checklist</h4>
            <div className="space-y-2.5">
              {marketingAudit.checks.map((chk, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-start gap-3">
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-900">{chk.title}</div>
                      <div className="text-[11px] text-slate-600 leading-relaxed">{chk.details}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                      chk.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {chk.passed ? 'PASSED' : 'RECOMMENDED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
