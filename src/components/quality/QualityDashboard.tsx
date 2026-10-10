import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Search,
  Link2,
  FileCode2,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { generateProjectHtml } from '../../services/htmlRenderer';
import { analyzeHtmlQuality } from '../../services/qualityService';
import { QualityCheck } from '../../types';

export const QualityDashboard: React.FC = () => {
  const { activeProject } = useProject();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const report = useMemo(() => {
    const html = generateProjectHtml(activeProject);
    return analyzeHtmlQuality(html);
  }, [activeProject, refreshTrigger]);

  const categories = [
    { id: 'all', label: 'All Checks' },
    { id: 'accessibility', label: 'Accessibility (a11y)', icon: ShieldCheck },
    { id: 'responsiveness', label: 'Responsiveness', icon: Smartphone },
    { id: 'seo', label: 'SEO & Metadata', icon: Search },
    { id: 'links', label: 'Links & Integrity', icon: Link2 },
    { id: 'html', label: 'HTML Structure', icon: FileCode2 },
    { id: 'performance', label: 'Performance', icon: Gauge },
  ];

  const filteredChecks = useMemo(() => {
    if (selectedCategory === 'all') return report.checks;
    return report.checks.filter((c) => c.category === selectedCategory);
  }, [report, selectedCategory]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Top Score Banner */}
      <div className="bg-dark-850 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <h2 className="text-xl font-extrabold text-white">Project Quality & Testing Lab</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              Measured In-Browser
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Audit results for <span className="text-white font-semibold">{activeProject.name}</span>.
            Scores reflect real DOM structure, WCAG contrast standards, viewport responsiveness, and semantic tags.
          </p>
        </div>

        {/* Score Radial Indicator */}
        <div className="flex items-center gap-6">
          <div
            className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center font-extrabold ${getScoreColor(
              report.overallScore
            )}`}
          >
            <span className="text-2xl leading-none">{report.overallScore}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-1">
              Health
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{report.summary.passed} Passed Checks</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{report.summary.warning} Warnings</span>
            </div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              <span>{report.summary.failed} Critical Failures</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{report.summary.unavailable} Level 2 Telemetry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
              selectedCategory === c.id
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                : 'bg-dark-850 hover:bg-dark-750 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {c.icon && <c.icon className="w-3.5 h-3.5" />}
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Checks Grid */}
      <div className="space-y-3">
        {filteredChecks.map((check) => (
          <div
            key={check.id}
            className="bg-dark-850 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start justify-between gap-4 transition-all hover:border-white/20"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-white">{check.name}</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    check.status === 'passed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : check.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : check.status === 'failed'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {check.status === 'passed'
                    ? 'Passed ✓'
                    : check.status === 'warning'
                    ? 'Warning ⚠'
                    : check.status === 'failed'
                    ? 'Failed ✕'
                    : 'Level 2 Runner'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono capitalize">
                  {check.category}
                </span>
                {check.isEstimated && (
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                    Estimated Metric
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{check.description}</p>

              <div className="pt-2 border-t border-white/5 space-y-1 text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-500 font-semibold">Measurement: </span>
                  {check.explanation}
                </div>
                <div className="text-accent-cyan">
                  <span className="text-slate-500 font-semibold">Recommendation: </span>
                  {check.fixRecommendation}
                </div>
                {check.location && (
                  <div className="text-[11px] font-mono text-slate-400 bg-dark-900 p-1.5 rounded border border-white/5">
                    {check.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
