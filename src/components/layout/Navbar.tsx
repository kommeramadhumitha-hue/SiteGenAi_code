import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Globe, ArrowRight, Wrench } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useSettings();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/templates', label: 'Templates' },
    { to: '/repair', label: 'Repair Studio', isTool: true },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-700 p-0.5 shadow-sm shadow-blue-700/15 group-hover:shadow-blue-700/30 transition-all duration-300">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-700 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                SiteGen<span className="text-blue-700">.AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {t.common.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `transition-colors flex items-center gap-1.5 cursor-pointer py-1 border-b-2 text-[13px] ${
                  isActive
                    ? 'text-blue-700 border-blue-700 font-bold'
                    : 'text-slate-600 hover:text-blue-700 border-transparent'
                }`
              }
            >
              {item.isTool && <Wrench className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right CTA + Language Switcher */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            title="Switch Language: English / తెలుగు"
          >
            <Globe className="w-3.5 h-3.5 text-blue-700" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Sign In / User Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/generator"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                title={user?.email}
              >
                <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
                <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
              </Link>
              <button
                onClick={logout}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `px-3.5 py-2 text-xs font-semibold transition-colors ${
                  isActive ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-700'
                }`
              }
            >
              {t.common.signIn}
            </NavLink>
          )}

          <Link
            to="/generator"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm shadow-blue-700/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            <span>{t.common.startBuilding}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col gap-1 font-semibold text-slate-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 px-3 rounded-lg flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'hover:bg-slate-50 hover:text-indigo-600'
                  }`
                }
              >
                {item.isTool && <Wrench className="w-4 h-4" />}
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="border-t border-slate-100 my-2 pt-2">
              <NavLink
                to="/generator"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 px-3 rounded-lg flex items-center gap-2 font-bold ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-indigo-600 hover:bg-indigo-50/50'
                  }`
                }
              >
                <span>AI Generator (Free Workspace)</span>
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 block text-xs text-slate-600"
              >
                Projects Dashboard
              </NavLink>
              <NavLink
                to="/quality"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 block text-xs text-slate-600"
              >
                Quality Lab
              </NavLink>
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 rounded-lg bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-between">
                    <span className="truncate">{user?.name}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-3 rounded-lg hover:bg-rose-50 block text-xs text-rose-600 font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-slate-50 block text-xs text-slate-600"
                >
                  Sign In / Create Account
                </NavLink>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Language: {language === 'en' ? 'English' : 'తెలుగు'}</span>
            </button>
            <Link
              to="/generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Start Building Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
