import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Wand2,
  LayoutTemplate,
  Wrench,
  CheckCircle2,
  Code2,
  Rocket,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useSettings } from '../../context/SettingsContext';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { projects, activeProject, setActiveProject, createNewProject } = useProject();
  const { t } = useSettings();
  const navigate = useNavigate();

  const handleCreateNew = async () => {
    const newProj = await createNewProject('saas', 'A high-converting tech startup website');
    navigate('/generator');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: t.common.dashboard, icon: LayoutDashboard },
    { to: '/generator', label: t.common.generator, icon: Wand2, highlight: true },
    { to: '/templates', label: t.common.templates, icon: LayoutTemplate },
    { to: '/repair', label: t.common.repairStudio, icon: Wrench, accent: true },
    { to: '/marketing', label: 'Marketing AI', icon: Sparkles },
    { to: '/quality', label: t.common.qualityLab, icon: CheckCircle2 },
    { to: '/export', label: t.common.code, icon: Code2 },
    { to: '/deploy', label: t.common.deployments, icon: Rocket },
    { to: '/settings', label: t.common.settings, icon: Settings },
  ];

  return (
    <aside
      className={`bg-slate-50 border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand + New Project */}
      <div>
        {/* Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 min-w-9 rounded-xl bg-blue-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            {!collapsed && (
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                SiteGen<span className="text-blue-600">.AI</span>
              </span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick New Project Button */}
        <div className="p-3">
          <button
            onClick={handleCreateNew}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all ${
              collapsed ? 'px-0' : ''
            }`}
            title="Create New Website Project"
          >
            <Plus className="w-4 h-4" />
            {!collapsed && <span>New Website (Free)</span>}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    item.accent
                      ? 'text-blue-600'
                      : item.highlight
                      ? 'text-blue-600'
                      : 'text-slate-500'
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Recent project switcher and free tier notice */}
      <div className="p-3 border-t border-slate-200 bg-white">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>Active Project</span>
              <span className="text-emerald-600 font-semibold">Active</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900 truncate">{activeProject.name}</div>
              <div className="text-[10px] text-slate-500 flex items-center justify-between">
                <span>{activeProject.sections.length} Sections</span>
                <span className="capitalize">{activeProject.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-medium">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
              <span>Free to use — no subscription required</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Free Tier: Ready">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
