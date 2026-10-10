import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Sliders,
  Key,
  Database,
  Github,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, updateIntegrations, language, setLanguage, t } = useSettings();

  const [aiKeyInput, setAiKeyInput] = useState('');
  const [githubTokenInput, setGithubTokenInput] = useState('');
  const [vercelTokenInput, setVercelTokenInput] = useState('');
  const [mongoUriInput, setMongoUriInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiKeyInput.trim()) {
      const masked = '••••••••' + aiKeyInput.slice(-4);
      updateIntegrations({
        aiApiKeyConfigured: true,
        aiApiKeyMasked: masked,
      });
      setAiKeyInput('');
    }

    if (githubTokenInput.trim()) {
      updateIntegrations({
        githubConnected: true,
        githubTokenConfigured: true,
        githubPat: githubTokenInput.trim(),
      });
      setGithubTokenInput('');
    }

    if (vercelTokenInput.trim()) {
      updateIntegrations({
        deploymentProviderConnected: true,
        deploymentTokenConfigured: true,
        vercelTokenConfigured: true,
        vercelToken: vercelTokenInput.trim(),
      });
      setVercelTokenInput('');
    }

    if (mongoUriInput.trim()) {
      updateIntegrations({
        mongoDbConnected: true,
        mongoDbUriConfigured: true,
      });
      setMongoUriInput('');
    }

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset local demo cache to original factory seed projects?')) {
      localStorage.removeItem('sitegen_projects');
      localStorage.removeItem('sitegen_deployments');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-900">Platform Settings & Integrations</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              Free Access Tier
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Configure appearance, interface language, generative AI keys, and connected backend services with zero customer payment.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Section 1: Appearance & UI Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Appearance & Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Theme */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Color Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="light">Clean Professional White (Default)</option>
              <option value="dark">Dark Slate / Charcoal</option>
              <option value="midnight">Midnight OLED Black</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Interface Language</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  language === 'te'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-semibold text-slate-900">Reduced Motion</div>
              <div className="text-[11px] text-slate-500">Disable non-essential ambient animations</div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Default Export Format */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Default Export Architecture</label>
            <select
              value={settings.defaultExportFormat}
              onChange={(e) => updateSettings({ defaultExportFormat: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-blue-500"
            >
              <option value="html">Semantic HTML5 + Vanilla CSS + JS</option>
              <option value="react">React 19 + Tailwind CSS Component</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: AI & Backend Integrations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Key className="w-4 h-4 text-blue-600" />
          <span>API Keys & Service Integrations</span>
        </h3>

        <form onSubmit={handleSaveApiKeys} className="space-y-4 text-xs">
          {/* AI Generative Provider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">
                AI Generative Provider (Google Gemini / OpenAI / Anthropic)
              </label>
              <span className="text-[11px] text-slate-500">
                Status:{' '}
                {settings.integrations.aiApiKeyConfigured ? (
                  <span className="text-emerald-600 font-semibold">
                    Configured ({settings.integrations.aiApiKeyMasked})
                  </span>
                ) : (
                  <span className="text-blue-600 font-semibold">Default Free Generator Active</span>
                )}
              </span>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={aiKeyInput}
                onChange={(e) => setAiKeyInput(e.target.value)}
                placeholder={
                  settings.integrations.aiApiKeyConfigured
                    ? settings.integrations.aiApiKeyMasked
                    : 'Paste optional custom AI key (e.g. AIzaSy... or sk-...)'
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-blue-500 font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* GitHub Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">GitHub Personal Access Token (PAT)</label>
              <span className="text-[11px] text-slate-500">
                {settings.integrations.githubConnected ? (
                  <span className="text-emerald-600 font-semibold">Connected</span>
                ) : (
                  <span className="text-slate-500">Optional for direct GitHub repo publishing</span>
                )}
              </span>
            </div>
            <input
              type="password"
              value={githubTokenInput}
              onChange={(e) => setGithubTokenInput(e.target.value)}
              placeholder="ghp_••••••••••••••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Vercel Deployment Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">Vercel API Token (Edge Hosting)</label>
              <span className="text-[11px] text-slate-500">
                {settings.integrations.vercelTokenConfigured ? (
                  <span className="text-emerald-600 font-semibold">Connected</span>
                ) : (
                  <span className="text-slate-500">Optional for production edge deployments</span>
                )}
              </span>
            </div>
            <input
              type="password"
              value={vercelTokenInput}
              onChange={(e) => setVercelTokenInput(e.target.value)}
              placeholder="vercel_••••••••••••••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* MongoDB Connection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-700 font-semibold">MongoDB Connection URI</label>
              <span className="text-[11px] text-slate-500">
                {settings.integrations.mongoDbConnected ? (
                  <span className="text-emerald-600 font-semibold">Connected</span>
                ) : (
                  <span className="text-slate-500">Ready for persistence</span>
                )}
              </span>
            </div>
            <input
              type="password"
              value={mongoUriInput}
              onChange={(e) => setMongoUriInput(e.target.value)}
              placeholder="mongodb+srv://admin:••••@cluster.mongodb.net/sitegen"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Integrations</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Reset / Factory Restore */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-600">Restore Factory Fixtures</h4>
          <p className="text-[11px] text-slate-500">
            Resets all local saved projects, broken website samples, and deployments to initial starter state.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Cache</span>
        </button>
      </div>
    </div>
  );
};
