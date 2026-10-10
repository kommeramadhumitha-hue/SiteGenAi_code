import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Layers,
  Code2,
  Rocket,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Terminal,
  Cpu,
  FileCheck,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Your Natural Language Vision',
      subtitle: 'Prompt & Idea Ingestion',
      desc: 'Describe your website goals in simple English or Telugu. Tell SiteGen AI about your business, target audience, layout preferences, and key conversion objectives.',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      details: [
        'Supports natural language in English and Telugu (తెలుగు)',
        'Automatically classifies business domain (SaaS, Restaurant, Portfolio, Agency, E-commerce, Education)',
        'Extracts design mood, color preferences, and functional needs',
      ],
    },
    {
      step: '02',
      title: 'Multi-Agent Semantic Synthesis',
      subtitle: 'Architecture & Token Design',
      desc: 'The backend orchestrator executes 6 specialized AI agents. The Architectural Planner builds the section tree, the Design Token Formulator crafts WCAG-compliant color palettes and Google Font pairings, and the Content Synthesizer generates bespoke copy without lorem ipsum.',
      icon: Cpu,
      color: 'bg-violet-50 text-violet-600 border-violet-200',
      details: [
        'Architecture Agent establishes semantic navbar, hero, cards, and footer',
        'Style Token Agent formulates HSL-calibrated primary and surface palettes',
        'Content Generation Agent synthesizes concrete headlines, badges, and pricing tiers',
      ],
    },
    {
      step: '03',
      title: 'Interactive Studio Editing & AI Copilot',
      subtitle: 'Visual Refinement & Customization',
      desc: 'Preview the generated site in a strictly sandboxed live iframe across Desktop, Tablet, and Mobile views. Use the AI Copilot to modify styling, reorder sections, add FAQs, or switch palettes on the fly.',
      icon: Layers,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      details: [
        'Sandboxed iframe prevents script execution risks against the parent app',
        'Section outline tree with 1-click toggle, reorder, delete, and add controls',
        'AI Copilot Chat for conversational section refinements',
      ],
    },
    {
      step: '04',
      title: 'Quality Lab Audit & Code Repair',
      subtitle: 'Validation & Accessibility Checks',
      desc: 'The Quality Lab runs automated audits against the DOM: heading hierarchy (single <h1>), WCAG contrast ratios, link integrity, and responsive viewport tags. Run the Repair Studio to automatically patch any detected anomalies.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      details: [
        'Automated 0-100 objective score across a11y, SEO, and responsiveness',
        'Diagnostics for unlabelled inputs, broken links, and rigid non-fluid CSS',
        '1-click instant repair patches with visual side-by-side diff previews',
      ],
    },
    {
      step: '05',
      title: 'Export Clean Code or 1-Click Cloud Deploy',
      subtitle: 'Production Delivery',
      desc: 'Export a completely standalone, zero-bloat ZIP archive containing semantic index.html, styles.css, script.js, and React components, or push directly to GitHub and launch a live edge deployment in seconds.',
      icon: Rocket,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      details: [
        'Zero vendor lock-in with clean semantic HTML5, pure CSS, and JS',
        '1-click SiteGen Instant Cloud hosting with working public live URL',
        'Official GitHub REST API integration for public and private repositories',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-20 border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Step-by-Step Platform Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              How SiteGen AI Works
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              From natural language idea to live production code in five structured steps. Here is how our multi-agent pipeline powers your development workflow.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/generator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                <span>Try It Now — Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all shadow-xs"
              >
                <span>View All Features</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Steps Timeline */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {steps.map((s, index) => {
              const Icon = s.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all relative"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl sm:text-4xl font-black font-mono text-indigo-600">
                        {s.step}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                          {s.subtitle}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{s.title}</h2>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {s.desc}
                  </p>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Key Capabilities:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {s.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold mt-0.5">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 border-t border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Ready to experience autonomous web creation?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-6">
              Launch the generator workspace or test our automated repair studio with your existing code.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/generator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                <span>Launch Generator</span>
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
