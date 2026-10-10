import React, { useState } from 'react';
import { X, Check, Trash2, Plus, Sparkles } from 'lucide-react';
import { WebsiteSection } from '../../types';

interface SectionEditorModalProps {
  section: WebsiteSection;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<WebsiteSection>) => void;
  onRefineAi: (instruction: string) => void;
}

export const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  section,
  isOpen,
  onClose,
  onSave,
  onRefineAi,
}) => {
  if (!isOpen) return null;

  const [headline, setHeadline] = useState(section.content.headline || '');
  const [subheadline, setSubheadline] = useState(section.content.subheadline || '');
  const [badge, setBadge] = useState(section.content.badge || '');
  const [primaryCtaText, setPrimaryCtaText] = useState(section.content.primaryCtaText || '');
  const [primaryCtaUrl, setPrimaryCtaUrl] = useState(section.content.primaryCtaUrl || '');
  const [paddingY, setPaddingY] = useState(section.styles?.paddingY || 'normal');
  const [aiPrompt, setAiPrompt] = useState('');
  const [items, setItems] = useState<any[]>(section.content.items ? [...section.content.items] : []);

  const handleApply = () => {
    onSave({
      content: {
        ...section.content,
        headline,
        subheadline,
        badge,
        primaryCtaText,
        primaryCtaUrl,
        items,
      },
      styles: {
        ...section.styles,
        paddingY,
      },
    });
    onClose();
  };

  const handleAiRefine = () => {
    if (aiPrompt.trim()) {
      onRefineAi(aiPrompt.trim());
      setAiPrompt('');
      onClose();
    }
  };

  const handleItemChange = (idx: number, field: string, val: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: val };
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { title: 'New Item', description: 'Item description text.', icon: '✨' }]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-dark-850 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Edit {section.title}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-750 text-accent-cyan border border-white/5">
                {section.type}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Modify content, calls-to-action, or ask AI to refine.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-dark-750 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* AI Quick Prompt */}
          <div className="p-3.5 rounded-xl bg-primary-600/10 border border-primary-500/20 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-primary-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conversational AI Refinement</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder='e.g. "Add a limited-time 20% discount badge" or "Make tone more authoritative"'
                className="flex-1 bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAiRefine}
                className="px-3.5 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold"
              >
                Refine
              </button>
            </div>
          </div>

          {/* Badge */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Badge Tag</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Special Offer or New Feature"
              className="w-full bg-dark-900 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary-500"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Main Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Section primary heading"
              className="w-full bg-dark-900 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary-500"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Subheadline / Supporting Copy</label>
            <textarea
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              rows={3}
              placeholder="Descriptive copy..."
              className="w-full bg-dark-900 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary CTA Button Text</label>
              <input
                type="text"
                value={primaryCtaText}
                onChange={(e) => setPrimaryCtaText(e.target.value)}
                placeholder="Get Started"
                className="w-full bg-dark-900 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">CTA Target URL / Anchor</label>
              <input
                type="text"
                value={primaryCtaUrl}
                onChange={(e) => setPrimaryCtaUrl(e.target.value)}
                placeholder="#pricing or https://..."
                className="w-full bg-dark-900 border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Section Items (if any: features, pricing, stats, faqs) */}
          {items.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Section Cards / Items ({items.length})</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-dark-900 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.title || item.author || item.value || ''}
                        onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                        placeholder="Title / Heading / Name"
                        className="flex-1 bg-dark-800 border border-white/10 rounded px-2 py-1 text-white text-xs font-semibold"
                      />
                      {item.price !== undefined && (
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                          placeholder="$29"
                          className="w-16 bg-dark-800 border border-white/10 rounded px-2 py-1 text-white text-xs"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      value={item.description || item.label || ''}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      rows={2}
                      placeholder="Item description or details..."
                      className="w-full bg-dark-800 border border-white/10 rounded p-1.5 text-slate-300 text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-dark-750 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-lg shadow-primary-600/30"
          >
            <Check className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
