import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Wrench,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Zap,
  Globe,
  Code2,
  Layers,
  ChevronRight,
  Laptop,
  Tablet,
  Smartphone,
  Check,
  Star,
  Users,
  Compass,
  RotateCw,
  Eye,
  Terminal,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { SandboxedPreview } from '../components/preview/SandboxedPreview';
import { STARTER_TEMPLATES } from '../data/templates';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { WebsiteCategory } from '../types';

export const LandingPage: React.FC = () => {
  const { t, language } = useSettings();
  const { activeProject, createNewProject, loadTemplate } = useProject();
  const navigate = useNavigate();
  const location = useLocation();

  const [promptInput, setPromptInput] = useState(
    'A high-converting SaaS landing page for an AI developer copilot with clean white aesthetic, feature cards, and interactive testimonials.'
  );
  const [isStarting, setIsStarting] = useState(false);
  const [heroPreviewTab, setHeroPreviewTab] = useState<'live' | 'studio'>('live');

  // Rotating phrases for hero headline accent
  const rotatingPhrases = [
    'Autonomous Web Engine',
    'Intelligent UI Synthesis',
    'Instant Clean Code',
    'Production Deployment',
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleHashScroll = () => {
      if (location.hash) {
        const id = location.hash.replace('#', '');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Run on next frame so layout and child elements are measured
        requestAnimationFrame(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        });
      } else {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    };

    handleHashScroll();

    // Listen for hashchange events (e.g. back/forward navigation or manual URL edits)
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [location.pathname, location.hash]);

  const detectCategoryFromPrompt = (text: string): WebsiteCategory => {
    const lower = text.toLowerCase();
    if (lower.includes('restaurant') || lower.includes('coffee') || lower.includes('food') || lower.includes('bistro') || lower.includes('pizza') || lower.includes('menu') || lower.includes('bakery')) {
      return 'restaurant';
    }
    if (lower.includes('portfolio') || lower.includes('designer') || lower.includes('resume') || lower.includes('cv') || lower.includes('photographer')) {
      return 'portfolio';
    }
    if (lower.includes('store') || lower.includes('shop') || lower.includes('ecommerce') || lower.includes('clothing') || lower.includes('product')) {
      return 'ecommerce';
    }
    if (lower.includes('agency') || lower.includes('studio') || lower.includes('marketing') || lower.includes('consulting')) {
      return 'agency';
    }
    if (lower.includes('course') || lower.includes('school') || lower.includes('academy') || lower.includes('education') || lower.includes('learn')) {
      return 'education';
    }
    return 'saas';
  };

  const handleStartBuilding = async () => {
    setIsStarting(true);
    try {
      const promptToUse = promptInput.trim() || 'A modern responsive SaaS web application with interactive features';
      const categoryToUse = detectCategoryFromPrompt(promptToUse);
      // Immediately open generator workspace with autoGenerate: true to start real generation directly
      navigate('/generator', {
        state: {
          autoGenerate: true,
          prompt: promptToUse,
          category: categoryToUse,
        },
      });
    } catch (err) {
      console.error('Failed to initialize builder project:', err);
      navigate('/generator');
    } finally {
      setIsStarting(false);
    }
  };

  const samplePrompts = [
    { text: 'AI analytics engine with clean minimalist cards', cat: 'saas' },
    { text: 'Artisan coffee roastery website with online ordering menu', cat: 'restaurant' },
    { text: 'Minimalist UX designer portfolio with project case studies', cat: 'portfolio' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Hero Section with Layered Blue & Lavender Highlights and Floating Shapes */}
      <section id="home" className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-white">
        {/* Layered radial blue & lavender gradient backdrops */}
        <div className="pointer-events-none absolute -top-44 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-blue-100/40 via-indigo-100/30 to-violet-100/35 blur-[120px] rounded-full animate-ambient-glow" />
        <div className="pointer-events-none absolute top-20 -left-20 w-[420px] h-[420px] hero-glow-sphere-1 rounded-full" />
        <div className="pointer-events-none absolute top-40 -right-20 w-[460px] h-[460px] hero-glow-sphere-2 rounded-full" />

        {/* Subtle decorative floating geometric accents */}
        <div className="pointer-events-none absolute top-28 left-[12%] hidden lg:block animate-hero-float-slow opacity-60">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/20 border border-blue-200/50 backdrop-blur-xs rotate-12 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600/70" />
          </div>
        </div>
        <div className="pointer-events-none absolute top-36 right-[14%] hidden lg:block animate-hero-float-rev opacity-60">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500/15 to-indigo-500/10 border border-violet-200/60 backdrop-blur-xs -rotate-6 flex items-center justify-center">
            <Zap className="w-4 h-4 text-violet-600/70" />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-48 left-[8%] hidden xl:block animate-hero-float opacity-50">
          <div className="w-7 h-7 rounded-lg bg-blue-50/80 border border-blue-200/40 shadow-xs rotate-45" />
        </div>
        <div className="pointer-events-none absolute bottom-40 right-[10%] hidden xl:block animate-hero-float-slow opacity-50">
          <div className="w-6 h-6 rounded-full bg-violet-100/60 border border-violet-200/40 shadow-xs" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Subtle statement that no subscription is required */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-xs font-semibold text-slate-700 mb-8 shadow-xs backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>No SiteGen AI subscription required — Free to build & export</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.08] max-w-4xl mx-auto">
            From One Idea to a <span className="text-gradient-hero">Website You'll Love.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Describe your vision. Let AI create your website. Refine every detail, then publish when you're ready.
          </p>

          {/* Primary & Secondary Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14 relative z-20">
            <button
              onClick={handleStartBuilding}
              disabled={isStarting}
              id="hero-start-building-btn"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              {isStarting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                  <span>Preparing Workspace...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 text-white" />
                  <span>Start Building Free</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>

            <Link
              to="/templates"
              id="hero-explore-templates-btn"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-900 transition-all shadow-xs"
            >
              <Compass className="w-4 h-4 text-blue-700" />
              <span>Explore Templates</span>
            </Link>
          </div>

          {/* Natural Language Prompt Composer Box */}
          <div className="max-w-3xl mx-auto mb-16 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10 text-left">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Website Vision Prompt</span>
              <span className="text-blue-700 font-mono text-[11px]">natural language</span>
            </label>
            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={2}
                placeholder={t.landing.promptPlaceholder}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white resize-none font-sans transition-colors leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2 flex-wrap text-left">
                <span className="text-[11px] text-slate-500 font-semibold">Try:</span>
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPromptInput(p.text)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors truncate max-w-[210px] cursor-pointer font-medium"
                  >
                    {p.text}
                  </button>
                ))}
              </div>

              <button
                onClick={handleStartBuilding}
                disabled={isStarting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-700 hover:bg-blue-800 transition-all flex-shrink-0 cursor-pointer shadow-sm"
              >
                <span>Generate Website</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>          {/* High-Quality Hero Visual Asset Showcase with Italian Restaurant Preview & Floating UI Cards */}
          <div className="mt-10 max-w-5xl mx-auto relative">
            {/* Soft blurred glow effects positioned around the preview */}
            <div className="pointer-events-none absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl -z-10" />

            {/* Floating UI Card 1: AI Generated Badge (Top Left) */}
            <div className="absolute -top-5 -left-4 sm:-left-8 z-30 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.1)] animate-hero-float-slow text-left">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-2xs">
                <Sparkles className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">AI Generated</div>
                <div className="text-xs font-extrabold text-slate-900">Trattoria Bella Roma</div>
              </div>
            </div>

            {/* Floating UI Card 2: AI Prompt Pill (Top Right) */}
            <div className="absolute -top-5 -right-4 sm:-right-8 z-30 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.1)] animate-hero-float-rev text-left max-w-xs">
              <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200/80 flex items-center justify-center text-violet-700 shadow-2xs">
                <Code2 className="w-4 h-4 text-violet-700" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-violet-700">AI Prompt</div>
                <div className="text-xs font-semibold text-slate-800 truncate">"Authentic Italian trattoria with handmade pasta"</div>
              </div>
            </div>

            {/* Floating UI Card 3: Responsive Preview Controls (Bottom Left) */}
            <div className="absolute -bottom-6 -left-4 sm:-left-8 z-30 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.1)] animate-hero-float text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                <Laptop className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Responsive Preview</div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1 text-[11px]"><Laptop className="w-3 h-3 text-slate-500" /> Desktop</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-[11px]"><Tablet className="w-3 h-3 text-slate-500" /> Tablet</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-[11px]"><Smartphone className="w-3 h-3 text-slate-500" /> Mobile</span>
                </div>
              </div>
            </div>

            {/* Floating UI Card 4: Quality & Speed (Bottom Right) */}
            <div className="absolute -bottom-6 -right-4 sm:-right-8 z-30 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.1)] animate-hero-float-slow text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Performance</div>
                <div className="text-xs font-extrabold text-slate-900">WCAG AAA • 100% Mobile Ready</div>
              </div>
            </div>

            {/* Browser-style showcase frame */}
            <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] bg-white p-2 sm:p-3 relative">
              {/* Browser chrome header bar */}
              <div className="h-11 bg-slate-50 rounded-xl px-4 flex items-center justify-between border-b border-slate-200/80 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-mono text-slate-500 pl-3 hidden sm:inline">https://bella-roma.sitegen.live</span>
                </div>
                
                {/* Device Indicators */}
                <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg border border-slate-200 text-xs">
                  <span className="p-1 rounded bg-white text-blue-700 shadow-2xs" title="Desktop View">
                    <Laptop className="w-3.5 h-3.5" />
                  </span>
                  <span className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Tablet View">
                    <Tablet className="w-3.5 h-3.5" />
                  </span>
                  <span className="p-1 rounded text-slate-500 hover:text-slate-800 transition-colors" title="Mobile View">
                    <Smartphone className="w-3.5 h-3.5" />
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden sm:inline">Live Studio Preview</span>
                </span>
              </div>

              {/* Inside the Browser Preview: Attractive Italian Restaurant Website Showcase */}
              <div className="rounded-xl overflow-hidden border border-slate-100 bg-[#fafaf9] text-left text-slate-900 font-sans shadow-inner">
                {/* Restaurant Navigation Bar */}
                <div className="bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-stone-200/80 flex items-center justify-between gap-4 sticky top-0 z-20">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍷</span>
                    <div>
                      <span className="font-extrabold text-base tracking-tight text-stone-900 font-serif">Trattoria Bella Roma</span>
                      <span className="text-[10px] text-stone-500 block -mt-1 font-sans">Cucina Tradizionale dal 1984</span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
                    <span className="hover:text-red-700 transition-colors cursor-pointer">Antipasti</span>
                    <span className="hover:text-red-700 transition-colors cursor-pointer font-bold text-red-700">Handmade Pasta</span>
                    <span className="hover:text-red-700 transition-colors cursor-pointer">Heritage Wines</span>
                    <span className="hover:text-red-700 transition-colors cursor-pointer">About Us</span>
                  </div>
                  <button
                    onClick={handleStartBuilding}
                    className="px-4 py-2 rounded-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book a Table</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Restaurant Hero Welcome Section */}
                <div className="relative py-12 px-6 sm:px-10 bg-gradient-to-b from-stone-50 via-white to-stone-50/50 border-b border-stone-200/60 overflow-hidden">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-[10px] font-bold uppercase tracking-wider mb-3">
                      <span>🍝</span> Authentic Wood-Fired & Fresh Extruded
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-serif leading-tight mb-3">
                      Three Generations of Italian Culinary Soul.
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 font-sans">
                      Experience organic San Marzano tomatoes, hand-rolled tagliolini, 30-month aged Parmigiano Reggiano, and cellar wines poured with family warmth.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleStartBuilding}
                        className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                      >
                        Reserve Table for Tonight
                      </button>
                      <button
                        onClick={handleStartBuilding}
                        className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs border border-stone-300 transition-colors cursor-pointer"
                      >
                        Explore Dinner Menu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Featured Dish Section & Menu Cards */}
                <div className="p-6 sm:p-8 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-0.5">Chef's Signature Selection</div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-serif">Featured Seasonal Dishes</h3>
                    </div>
                    <span className="text-xs font-semibold text-stone-500 font-sans hidden sm:inline">Fresh Daily Specials</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Dish Card 1 */}
                    <div className="rounded-xl border border-stone-200/90 p-4 bg-stone-50/60 hover:bg-white hover:shadow-md transition-all">
                      <div className="text-3xl mb-3">🍝</div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-stone-900 font-serif">Tagliolini al Tartufo</h4>
                        <span className="text-xs font-bold text-red-700 font-mono">€24</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        Hand-spun egg ribbons tossed in cultured mountain butter, Parmigiano, and shaved Norcia black winter truffle.
                      </p>
                    </div>

                    {/* Dish Card 2 */}
                    <div className="rounded-xl border border-stone-200/90 p-4 bg-stone-50/60 hover:bg-white hover:shadow-md transition-all">
                      <div className="text-3xl mb-3">🍕</div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-stone-900 font-serif">Margherita D.O.P.</h4>
                        <span className="text-xs font-bold text-red-700 font-mono">€18</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        Woodfired crust fermented for 72 hours, crushed San Marzano tomatoes, buffalo mozzarella, and fresh basil.
                      </p>
                    </div>

                    {/* Dish Card 3 */}
                    <div className="rounded-xl border border-stone-200/90 p-4 bg-stone-50/60 hover:bg-white hover:shadow-md transition-all">
                      <div className="text-3xl mb-3">🍮</div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-stone-900 font-serif">Tiramisù Tradizionale</h4>
                        <span className="text-xs font-bold text-red-700 font-mono">€11</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans">
                        Velvety mascarpone cream, espresso-dipped Savoiardi biscuits, and 70% dark Venezuelan cocoa dust.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Restaurant Bar */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-sans">
                    <div className="flex items-center gap-4">
                      <span>📍 Piazza Navona 14, Roma</span>
                      <span>⏰ Open Tue – Sun (18:00 – 23:30)</span>
                    </div>
                    <span className="text-stone-800 font-semibold">Michelin Guide Recommended 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Creation Flow */}
      <section id="how-it-works" className="py-24 border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
              Simple 3-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              From Idea to Published Website
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              No complex setup or coding required. SiteGen AI synthesizes full semantic layouts in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe Your Vision',
                desc: 'Enter what you need in plain words or select from curated presets. Choose your category, preferred mood, and content requirements.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Generate & Refine',
                desc: 'Watch the full multi-section website appear instantly. Rearrange sections, edit copy inline, or use the AI Copilot to refine any block.',
                icon: Code2,
              },
              {
                step: '03',
                title: 'Export or Publish Live',
                desc: 'Download clean production HTML/CSS ZIP archives, commit directly to your GitHub repository, or deploy instantly to the cloud.',
                icon: Rocket,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-8 relative hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-slate-300 font-mono group-hover:text-blue-700 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Website Category Showcases (Restaurant, SaaS, Portfolio, E-Commerce) */}
      <section className="py-24 border-t border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-16">
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
                Curated Blueprints
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Designed for Real-World Websites
              </h2>
            </div>
            <Link
              to="/templates"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
            >
              <span>Explore All Blueprints</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'tmpl-restaurant',
                title: 'Trattoria & Bistro',
                category: 'Restaurant',
                badge: 'Food & Dining',
                desc: 'Rich seasonal menu cards, table reservation triggers, Chef specials, and opening hours.',
                accentColor: 'border-amber-200 bg-amber-50/50 text-amber-800',
              },
              {
                id: 'tmpl-saas',
                title: 'Apex Intelligence',
                category: 'SaaS Platform',
                badge: 'Software & Tech',
                desc: 'Clean white hero, dynamic feature cards, interactive metrics, and contact demos.',
                accentColor: 'border-blue-200 bg-blue-50/50 text-blue-800',
              },
              {
                id: 'tmpl-portfolio',
                title: 'Elena Vance Studio',
                category: 'Portfolio',
                badge: 'Creative & Design',
                desc: 'Minimalist typography, client project case studies, skill grids, and booking form.',
                accentColor: 'border-slate-200 bg-slate-100/70 text-slate-800',
              },
              {
                id: 'tmpl-store',
                title: 'SoundWave Hardware',
                category: 'Online Store',
                badge: 'E-Commerce',
                desc: 'High-converting product showcase, tech specifications, customer ratings, and checkout.',
                accentColor: 'border-emerald-200 bg-emerald-50/50 text-emerald-800',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${card.accentColor}`}>
                      {card.badge}
                    </span>
                    <span className="text-xs font-medium text-slate-400 font-mono">0{i + 1}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                    {card.desc}
                  </p>
                </div>
                <button
                  onClick={() => {
                    loadTemplate(card.id);
                    navigate('/generator');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-700 hover:text-white text-slate-800 font-bold text-xs border border-slate-200 hover:border-blue-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Build with This Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concise Features Section */}
      <section id="features" className="py-24 border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">
              Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Built for Modern Web Standards
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Every site generated adheres to clean semantic HTML5, zero bloat, and fast load speeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Semantic Section Synthesis',
                desc: 'Generates real semantic HTML5 blocks with unique IDs, accessible landmarks, and clean responsive CSS.',
                icon: Zap,
              },
              {
                title: 'Code Repair Studio',
                desc: 'Analyzes broken or legacy HTML/CSS. Detects missing viewports, unclosed tags, and rigid widths with verified diffs.',
                icon: Wrench,
              },
              {
                title: 'Automated Quality Scoring',
                desc: 'Built-in auditor checking WCAG color contrast, heading hierarchy, meta descriptions, and mobile responsiveness.',
                icon: CheckCircle2,
              },
              {
                title: 'Isolated Sandboxed Preview',
                desc: 'View live renders safely across Desktop, Tablet, and Mobile devices within secure iframe sandboxing.',
                icon: ShieldCheck,
              },
              {
                title: 'ZIP Export & Source Code',
                desc: 'Download your entire website as a ready-to-run ZIP archive with zero build dependencies required.',
                icon: Code2,
              },
              {
                title: 'GitHub & Edge Publishing',
                desc: 'Commit directly to GitHub repositories or connect live hosting via Vercel, Netlify, and Cloudflare.',
                icon: Rocket,
              },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50/50 border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-blue-700 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 border-t border-slate-200/80 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Start Creating Your Website Today
          </h2>
          <p className="text-base text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
            Turn your ideas into live, responsive websites in seconds. Completely free to build, customize, and export.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleStartBuilding}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-white" />
              <span>Start Building Free</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <Link
              to="/templates"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 transition-all shadow-xs"
            >
              <span>Explore Templates</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">SiteGen.AI</span>
            <span>— From One Idea to a Website You'll Love.</span>
          </div>
          <div className="text-slate-600">
            Free to use — no subscription required. Built with React & Tailwind CSS.
          </div>
        </div>
      </footer>
    </div>
  );
};
