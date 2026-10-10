import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  X,
  Palette,
} from 'lucide-react';
import { STARTER_TEMPLATES } from '../data/templates';
import { Template } from '../types';
import { useProject } from '../context/ProjectContext';
import { SandboxedPreview } from '../components/preview/SandboxedPreview';

export const TemplatesPage: React.FC = () => {
  const { loadTemplate } = useProject();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'saas', label: 'SaaS Platform' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'restaurant', label: 'Restaurant & Dining' },
    { id: 'agency', label: 'Agency & Studio' },
    { id: 'education', label: 'Education & EdTech' },
    { id: 'ecommerce', label: 'E-Commerce' },
  ];

  const filtered = STARTER_TEMPLATES.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleUseTemplate = (templateId: string) => {
    loadTemplate(templateId);
    navigate('/generator');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Starter Template Gallery</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              {STARTER_TEMPLATES.length} Free Templates
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Original, production-ready website templates. Every template genuinely loads into the generator with complete editable sections.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates or tags..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
          >
            {/* Visual gradient header */}
            <div className={`h-44 bg-gradient-to-tr ${tmpl.previewGradient} p-5 flex flex-col justify-between relative`}>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {tmpl.category}
                </span>
                <button
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 text-[11px] font-semibold text-white flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-white drop-shadow-md leading-tight">
                  {tmpl.title}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                {tmpl.description}
              </p>

              {/* Feature bullets */}
              <div className="space-y-1">
                {tmpl.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tmpl.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => handleUseTemplate(tmpl.id)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Use This Template (Free)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-sm text-slate-900">{previewTemplate.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase font-semibold border border-blue-200">
                  {previewTemplate.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleUseTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                >
                  Load in Generator (Free) →
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-slate-100/60 overflow-hidden">
              <SandboxedPreview
                project={previewTemplate.defaultProject as any}
                activeDevice="desktop"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
