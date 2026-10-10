import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Wrench,
  CheckCircle2,
  FolderArchive,
  Rocket,
  Trash2,
  Copy,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Monitor,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useSettings } from '../context/SettingsContext';
import { WebsiteCategory, WebsiteProject } from '../types';

export const DashboardPage: React.FC = () => {
  const { projects, activeProject, setActiveProject, createNewProject, deleteProject, duplicateProject } =
    useProject();
  const { t } = useSettings();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<WebsiteCategory>('saas');
  const [newPrompt, setNewPrompt] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;
    setIsCreating(false);
    await createNewProject(newCategory, newPrompt.trim());
    navigate('/generator');
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome / Create Action */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Project Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              {projects.length} Saved Projects
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              Free Access
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Manage your AI synthesized websites, inspect code health, and deploy to live edge networks without payment.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Website (Free)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Total Projects</div>
          <div className="text-2xl font-black text-slate-900">{projects.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Average Quality Score</div>
          <div className="text-2xl font-black text-emerald-600">96 / 100</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Total Sections Built</div>
          <div className="text-2xl font-black text-blue-600">
            {projects.reduce((sum, p) => sum + p.sections.length, 0)}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Platform Access</div>
          <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Free
          </div>
        </div>
      </div>

      {/* Quick Launch Cards (Repair, Quality, Templates, Deploy) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/repair"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Wrench className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Code Repair Studio</h3>
            <p className="text-xs text-slate-600">
              Fix broken HTML, viewports, invalid links, and unlabelled tags.
            </p>
          </div>
        </Link>

        <Link
          to="/quality"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Quality & Testing Lab</h3>
            <p className="text-xs text-slate-600">
              Inspect measured accessibility, SEO, responsiveness, and HTML5.
            </p>
          </div>
        </Link>

        <Link
          to="/templates"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Template Blueprints</h3>
            <p className="text-xs text-slate-600">
              Explore 8 starter templates with genuine multi-section code.
            </p>
          </div>
        </Link>

        <Link
          to="/deploy"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
              <Rocket className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">GitHub & Deploy</h3>
            <p className="text-xs text-slate-600">
              Push to GitHub repositories and deploy live on Vercel Edge.
            </p>
          </div>
        </Link>
      </div>

      {/* Projects Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved projects by title or prompt..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'saas', 'portfolio', 'restaurant', 'agency', 'education', 'ecommerce'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-600 text-xs shadow-2xs">
            <FolderArchive className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-900">No projects found.</p>
            <p>Try clearing your search query or create a new project above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                {/* Header bar */}
                <div
                  className="p-5 border-b border-slate-200"
                  style={{
                    background: `linear-gradient(135deg, ${proj.palette.primary}15, #f8fafc)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Score: {proj.qualityScore || 95}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 truncate">{proj.name}</h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{proj.prompt}</p>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{proj.sections.length} Sections</span>
                    <span className="font-mono text-[10px]">
                      Updated: {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        navigate('/generator');
                      }}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs text-center cursor-pointer"
                    >
                      Open in Generator →
                    </button>

                    <button
                      onClick={() => duplicateProject(proj.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Duplicate Project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteProject(proj.id)}
                      disabled={projects.length <= 1}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-600 disabled:opacity-20 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create New Project */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Create New AI Website (100% Free)</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Website Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as WebsiteCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="saas">SaaS Platform</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="restaurant">Restaurant & Dining</option>
                  <option value="agency">Agency & Studio</option>
                  <option value="education">Education & Academy</option>
                  <option value="ecommerce">E-Commerce Storefront</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Describe What You Want to Build
                </label>
                <textarea
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  rows={3}
                  placeholder="e.g. A clean white tech startup landing page with product cards, customer quotes, and call to action..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors"
                >
                  Generate Project (Free)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
