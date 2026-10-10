import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Trash2,
  Edit3,
  Plus,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { WebsiteSection, SectionType } from '../../types';
import { SectionEditorModal } from './SectionEditorModal';

interface SectionListProps {
  sections: WebsiteSection[];
  onToggleVisibility: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onUpdateSection: (id: string, updated: Partial<WebsiteSection>) => void;
  onRemoveSection: (id: string) => void;
  onAddSection: (type: SectionType) => void;
  onRefineSectionAi: (id: string, prompt: string) => void;
  onRegenerateEntireSite?: () => void;
}

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  onToggleVisibility,
  onReorder,
  onUpdateSection,
  onRemoveSection,
  onAddSection,
  onRefineSectionAi,
  onRegenerateEntireSite,
}) => {
  const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const availableTypes: { type: SectionType; label: string; icon: string }[] = [
    { type: 'navbar', label: 'Navbar / Header', icon: '🧭' },
    { type: 'hero', label: 'Hero Banner', icon: '🚀' },
    { type: 'features', label: 'Features Grid', icon: '⚡' },
    { type: 'about', label: 'About Story', icon: '📖' },
    { type: 'product', label: 'Product Showcase', icon: '📦' },
    { type: 'pricing', label: 'Pricing Tiers', icon: '💳' },
    { type: 'testimonials', label: 'Testimonials', icon: '💬' },
    { type: 'statistics', label: 'Statistics / Metrics', icon: '📊' },
    { type: 'gallery', label: 'Gallery Grid', icon: '🖼️' },
    { type: 'team', label: 'Team Members', icon: '👥' },
    { type: 'faq', label: 'FAQ Accordion', icon: '❓' },
    { type: 'blog', label: 'Blog Cards', icon: '📰' },
    { type: 'contact', label: 'Contact Form', icon: '✉️' },
    { type: 'newsletter', label: 'Newsletter / Waitlist', icon: '📬' },
    { type: 'cta', label: 'Call to Action', icon: '🎯' },
    { type: 'footer', label: 'Footer Links', icon: '⚓' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">Sections Outline</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
            {sections.length}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Section</span>
          </button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">
                Select Section Type
              </div>
              {availableTypes.map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    onAddSection(item.type);
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-left text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              section.isVisible
                ? 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-white'
                : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-slate-400 font-mono text-[10px] w-4">{idx + 1}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate max-w-[130px] sm:max-w-[180px]">
                  {section.title}
                </div>
                <div className="text-[10px] font-mono text-blue-600 uppercase font-medium">
                  {section.type}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Move Up */}
              <button
                onClick={() => onReorder(idx, Math.max(0, idx - 1))}
                disabled={idx === 0}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-20"
                title="Move section up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              {/* Move Down */}
              <button
                onClick={() => onReorder(idx, Math.min(sections.length - 1, idx + 1))}
                disabled={idx === sections.length - 1}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-20"
                title="Move section down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Toggle visibility */}
              <button
                onClick={() => onToggleVisibility(section.id)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200"
                title={section.isVisible ? 'Hide Section' : 'Show Section'}
              >
                {section.isVisible ? (
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Edit */}
              <button
                onClick={() => setEditingSection(section)}
                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-200"
                title="Edit section contents"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Remove */}
              <button
                onClick={() => onRemoveSection(section.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-200"
                title="Delete section"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing selected section */}
      {editingSection && (
        <SectionEditorModal
          section={editingSection}
          isOpen={Boolean(editingSection)}
          onClose={() => setEditingSection(null)}
          onSave={(updated) => onUpdateSection(editingSection.id, updated)}
          onRefineAi={(prompt) => onRefineSectionAi(editingSection.id, prompt)}
        />
      )}
    </div>
  );
};
