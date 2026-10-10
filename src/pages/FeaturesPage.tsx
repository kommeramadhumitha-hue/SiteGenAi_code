import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Code2,
  Rocket,
  ArrowRight,
  Layers,
  Sparkles,
  Bot,
  Globe,
  Palette,
  Terminal,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

export const FeaturesPage: React.FC = () => {
  const coreFeatures = [
    {
      title: 'Autonomous Multi-Agent Synthesis',
      category: 'AI Architecture',
      desc: 'Orchestrates 6 specialized backend agents in parallel: Requirements, Architectural Planning, Design Token Formulator, Content Synthesizer, Code Validator, and UX Explanation.',
      icon: Bot,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Instant Natural Language Generation',
      category: 'Prompt-to-Website',
      desc: 'Describe any vision in natural English or Telugu. Instantly generates complete semantic sections, realistic responsive cards, and curated typography.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      title: 'Automated HTML/CSS Repair Studio',
      category: 'Diagnostic Engine',
      desc: 'Upload broken HTML and CSS. The analyzer flags viewport issues, inaccessible forms, broken navigation, non-fluid pixel widths, and delivers 1-click diff patches.',
      icon: Wrench,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      title: 'Measured Quality & a11y Testing',
      category: 'Automated Auditing',
      desc: 'Runs live automated audits for WCAG contrast ratios, single <h1> heading structures, SEO meta tags, and fluid responsive grid integrity with an objective 0-100 score.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Strictly Sandboxed Safe Preview',
      category: 'Security & Runtime',
      desc: 'Isolated iframe sandbox with allow-scripts and allow-forms without allow-same-origin, preventing malicious script execution against parent storage or cookies.',
      icon: ShieldCheck,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      title: 'Zero-Bloat Clean Code Export',
      category: 'Developer Freedom',
      desc: 'Export pristine semantic HTML5, pure CSS variables, and vanilla JavaScript, or export React + Tailwind components. Download instant ZIP bundles with zero paywall.',
      icon: Code2,
      color: 'bg-violet-50 text-violet-600 border-violet-200',
    },
    {
      title: '1-Click GitHub Repository Publishing',
      category: 'Version Control',
      desc: 'Direct integration with GitHub REST API. Create public or private repos, commit all semantic source files, and inspect commit SHAs without leave the studio.',
      icon: Globe,
      color: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    {
      title: 'Real Cloud Edge CDN Deployments',
      category: 'Cloud Hosting',
      desc: 'Deploy live with 1-click SiteGen Instant Cloud hosting, or connect your personal Vercel and Netlify accounts for global edge distribution.',
      icon: Rocket,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Visual Design Token Editor',
      category: 'Visual Customization',
      desc: 'Switch color harmonies with calibrated palettes (Indigo, Emerald, Cyber Dark, Slate), modify Google Fonts, reorder sections, and refine with AI Copilot.',
      icon: Palette,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section className="py-16 md:py-20 border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Comprehensive Feature Suite • 100% Free</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything You Need to Build, Audit, and Ship
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore the autonomous multi-agent engine, automated repair laboratory, and one-click cloud publishing capabilities built into SiteGen AI.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/generator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                <span>Launch Studio & Start Building</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all shadow-xs"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Explore Starter Templates</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${feat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                          {feat.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">{feat.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Banner CTA */}
        <section className="py-16 border-t border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Ready to create your next website in seconds?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-6">
              No credit card or subscription needed. Generate a complete, accessible website or diagnose existing HTML/CSS code right now.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/generator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                <span>Start Building Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/repair"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                <Wrench className="w-4 h-4 text-indigo-600" />
                <span>Open Repair Studio</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SiteGen.AI</span>
            <span>— Build Smarter. Repair Faster.</span>
          </div>
          <div className="text-slate-600">Free to use — no subscription required. Built with React, Vite & Tailwind.</div>
        </div>
      </footer>
    </div>
  );
};
