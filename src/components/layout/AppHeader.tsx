import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Save,
  Download,
  Rocket,
  Code2,
  Globe,
  User,
  ExternalLink,
  Sparkles,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { downloadProjectAsZip } from '../../services/exportService';

export const AppHeader: React.FC = () => {
  const {
    activeProject,
    updateActiveProject,
    saveCurrentProject,
    activeDevice,
    setActiveDevice,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useProject();

  const { language, setLanguage, t } = useSettings();
  const { user, logout } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(activeProject.name);
  const [savedToast, setSavedToast] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    saveCurrentProject();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
      await downloadProjectAsZip(activeProject);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      updateActiveProject({ name: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'SG';

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/auth');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-xs">
      {/* Left: Project title & status */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-slate-50 text-slate-900 font-semibold text-sm px-2.5 py-1 rounded border border-blue-500 outline-none w-48 sm:w-64"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(activeProject.name);
                setIsEditingTitle(true);
              }}
              className="text-sm font-bold text-slate-900 hover:text-blue-600 truncate max-w-[160px] sm:max-w-xs transition-colors flex items-center gap-1.5"
              title="Click to rename project"
            >
              <span>{activeProject.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">✎</span>
            </button>
          )}

          <Link
            to="/quality"
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
            title="Inspect Quality & Accessibility Score"
          >
            <span>Score: {activeProject.qualityScore || 94}</span>
          </Link>
        </div>

        {/* Undo / Redo */}
        <div className="hidden md:flex items-center gap-1 pl-2 border-l border-slate-200">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
              !canUndo ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
              !canRedo ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Device preview switch */}
      <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveDevice('desktop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeDevice === 'desktop'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>
        <button
          onClick={() => setActiveDevice('tablet')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeDevice === 'tablet'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>
        <button
          onClick={() => setActiveDevice('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeDevice === 'mobile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Language */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
        </button>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
        >
          {savedToast ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Saved</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </button>

        {/* Source Code */}
        <button
          onClick={() => navigate('/export')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          title="View & Explore Generated Source Code"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Source Code</span>
        </button>

        {/* Export ZIP */}
        <button
          onClick={handleExportZip}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
          title="Download full project ZIP"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'ZIP'}</span>
        </button>

        {/* Deploy */}
        <button
          onClick={() => navigate('/deploy')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Deploy</span>
        </button>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold hover:bg-blue-700 transition-transform"
            title={user ? `${user.name} (${user.email})` : 'Account profile'}
          >
            {userInitials}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-900 truncate">
                    {user?.name || 'Authenticated User'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {user?.email || 'Logged in'}
                  </div>
                </div>
              </div>

              <div className="py-2 space-y-1 text-xs">
                <div className="px-2 py-1.5 rounded bg-blue-50 text-[11px] text-blue-800 flex items-center justify-between border border-blue-200">
                  <span>Session</span>
                  <span className="text-emerald-700 font-bold">Active</span>
                </div>
                <div className="px-2 py-1 text-[11px] text-slate-500">
                  Private website generator, code export, and cloud deployments.
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="block px-2 py-1.5 rounded hover:bg-slate-100 text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  Settings & Keys
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-2 py-1.5 rounded hover:bg-rose-50 text-xs font-medium text-rose-600 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
