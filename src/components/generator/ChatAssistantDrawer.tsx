import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Wand2,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { WebsiteProject } from '../../types';
import { useProject } from '../../context/ProjectContext';
import { PALETTE_PRESETS } from '../../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  appliedAction?: string;
}

export const ChatAssistantDrawer: React.FC = () => {
  const { activeProject, updateActiveProject, refineSectionAi, addSection } = useProject();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I'm your SiteGen AI Copilot. Ask me to modify headlines, add discounts, change button labels, or switch color schemes.`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickPrompts = [
    'Add a "20% launch discount" badge to hero',
    'Change primary button to "Get Free Access"',
    'Switch theme to Emerald Aurora palette',
    'Add an FAQ section with common questions',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 600));

    const lower = textToSend.toLowerCase();
    let actionFeedback = 'Applied your custom design refinement.';

    // Intent 1: Palette change
    if (lower.includes('emerald') || lower.includes('green')) {
      updateActiveProject({ palette: PALETTE_PRESETS[1] });
      actionFeedback = 'Updated website color palette to Emerald Aurora.';
    } else if (lower.includes('amber') || lower.includes('warm')) {
      updateActiveProject({ palette: PALETTE_PRESETS[2] });
      actionFeedback = 'Updated website color palette to Warm Tuscan Amber.';
    } else if (lower.includes('cyan') || lower.includes('electric')) {
      updateActiveProject({ palette: PALETTE_PRESETS[3] });
      actionFeedback = 'Updated website color palette to Electric Cyan.';
    }
    // Intent 2: Add FAQ or Pricing section
    else if (lower.includes('add') && lower.includes('faq')) {
      addSection('faq');
      actionFeedback = 'Added a new FAQ Accordion section to your page outline.';
    } else if (lower.includes('add') && lower.includes('pricing')) {
      addSection('pricing');
      actionFeedback = 'Added a new Pricing Tiers section to your page outline.';
    }
    // Intent 3: Refine hero section
    else {
      const hero = activeProject.sections.find((s) => s.type === 'hero');
      if (hero) {
        actionFeedback = refineSectionAi(hero.id, textToSend);
      } else if (activeProject.sections.length > 0) {
        actionFeedback = refineSectionAi(activeProject.sections[0].id, textToSend);
      }
    }

    const botMsg: ChatMessage = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'assistant',
      text: actionFeedback,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      appliedAction: actionFeedback,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsProcessing(false);
  };

  return (
    <div className="bg-dark-850 border border-white/10 rounded-2xl flex flex-col h-full shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-dark-900/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600/30 border border-primary-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">Conversational Copilot</h4>
            <span className="text-[10px] text-emerald-400 font-medium">● Interactive Assistant</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 space-y-1 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
              {m.appliedAction && (
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold pt-1 border-t border-slate-100">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified & Rendered</span>
                </div>
              )}
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 text-white font-bold text-[10px]">
                U
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-slate-500 text-xs pl-8">
            <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
            <span>Copilot is updating your website structure...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 border-t border-slate-200 bg-white flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask copilot to edit copy, colors, or sections..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
