import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Wrench,
  Rocket,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is SiteGen AI truly 100% free for all users?',
      a: 'Yes, absolutely. SiteGen AI is completely free to use with zero subscription fees, paywalls, or credit card requirements. All core capabilities—including AI generation, the Code Repair Studio, Quality Lab audits, clean code ZIP exports, and cloud deployments—are completely accessible to every user.',
      tag: 'Pricing & Access',
    },
    {
      q: 'What makes SiteGen AI different from other website builders?',
      a: 'SiteGen AI is an autonomous, multi-agent platform designed for high performance and developer freedom. Rather than locking you into proprietary page builders, it synthesizes pristine, semantic HTML5, pure CSS variables, and clean JavaScript that you can copy, export, and host anywhere.',
      tag: 'Platform Architecture',
    },
    {
      q: 'How does the automated Code Repair Studio work?',
      a: 'The Repair Studio parses raw HTML and CSS (either uploaded or pasted), identifying accessibility problems, missing responsive viewport meta tags, unlabelled form inputs, unclosed tags, non-fluid pixel widths, and broken links. It generates verified, side-by-side visual diff patches that you can apply with a single click.',
      tag: 'Repair & Diagnostics',
    },
    {
      q: 'Is the website preview safe from untrusted scripts?',
      a: 'Yes. SiteGen AI utilizes a strictly sandboxed iframe preview with sandbox="allow-scripts allow-forms" without allow-same-origin. This strictly isolates rendered websites from parent browser storage, cookies, and sensitive tokens.',
      tag: 'Security',
    },
    {
      q: 'Can I export the code as a ZIP archive?',
      a: 'Yes! You can export a comprehensive ZIP bundle containing index.html, styles.css, script.js, README.md, and React component code anytime with one click at zero charge.',
      tag: 'Export & Code',
    },
    {
      q: 'What languages are supported by the natural language engine?',
      a: 'SiteGen AI supports bilingual user prompts and interface interactions in both English and Telugu (తెలుగు), allowing regional entrepreneurs, students, and businesses to build websites effortlessly in their native language.',
      tag: 'Language Support',
    },
    {
      q: 'How do live cloud deployments work?',
      a: 'You can deploy instantly with 1-click SiteGen Instant Cloud hosting with zero third-party account requirements. Alternatively, you can connect your personal GitHub, Vercel, or Netlify accounts directly to publish code and launch global edge deployments.',
      tag: 'Deployment & Hosting',
    },
    {
      q: 'Does SiteGen AI support commercial client projects?',
      a: 'Yes. All generated code is 100% yours to keep, edit, host, and sell to clients with zero licensing fees or attribution requirements.',
      tag: 'Commercial Use',
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
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Frequently Asked Questions</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Answers to Common Questions
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find detailed explanations regarding SiteGen AI capabilities, pricing, code export, security sandboxing, and deployment options.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/generator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                <span>Launch Generator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-all shadow-xs"
              >
                <span>How It Works Guide</span>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 mb-1.5 inline-block">
                        {faq.tag}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{faq.q}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 border-t border-slate-200 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Still have questions? Try it hands-on.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-6">
              Start building an AI website or repair existing HTML/CSS in seconds with zero commitment.
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
