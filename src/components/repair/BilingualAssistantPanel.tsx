import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Send,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  ListOrdered,
  FileCode,
  ShieldCheck,
  RotateCcw,
  Info,
  Layers,
  ArrowRight,
  Bot,
  User,
  X,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { askBilingualAssistant, AssistantResponse } from '../../services/assistantService';

interface BilingualAssistantPanelProps {
  currentHtml?: string;
  currentCss?: string;
  onApplyPlan?: (planCode: string) => void;
  onOpenRepairLab?: () => void;
}

export const BilingualAssistantPanel: React.FC<BilingualAssistantPanelProps> = ({
  currentHtml = '',
  currentCss = '',
  onApplyPlan,
  onOpenRepairLab,
}) => {
  const { language, setLanguage } = useSettings();
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [response, setResponse] = useState<AssistantResponse | null>(null);

  // Telugu & English quick prompts
  const sampleQueries = language === 'te'
    ? [
        'నా వెబ్‌సైట్ మొబైల్ ఫోన్‌లో సరిగ్గా కనిపించడం లేదు, హారిజాంటల్ స్క్రోలింగ్ వస్తోంది.',
        'ఇమేజెస్‌కి ఆల్ట్ టెక్స్ట్ మిస్ అయ్యింది, స్క్రీన్ రీడర్ల కోసం ఎలా ఫిక్స్ చేయాలి?',
        'నావెబార్‌లో హోమ్ లేదా ఫీచర్స్ లింక్ క్లిక్ చేస్తే ఏమీ జరగడం లేదు.',
        'వెబ్‌సైట్ యాక్సెసిబిలిటీ స్కోర్‌ను 95+ కి ఎలా పెంచాలి?',
      ]
    : [
        'My website overflows horizontally on mobile phones with broken scaling.',
        'Images are missing alt text. How do I fix screen-reader accessibility?',
        'Navbar links click but do not scroll to sections smoothly.',
        'How can I boost my website accessibility & quality score to 95+?',
      ];

  const handleAskAssistant = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await askBilingualAssistant({
        message: textToSend.trim(),
        language,
        mode: 'repair',
        context: {
          html: currentHtml.slice(0, 3000),
          css: currentCss.slice(0, 1500),
        },
      });

      setResponse(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error consulting bilingual assistant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-dark-850 p-5 shadow-2xl space-y-5">
      {/* Header with Bilingual Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-violet via-primary-600 to-accent-cyan p-0.5 shadow-md shadow-primary-500/20">
            <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">
                {language === 'te' ? 'ద్విభాషా AI అసిస్టెంట్' : 'Bilingual AI Assistant'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20 text-[10px] font-bold">
                Telugu + English
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'te'
                ? 'వెబ్‌సైట్ నిర్మాణం మరియు రిపేర్ సమస్యలను తెలుగు లేదా ఇంగ్లీషులో వివరించండి'
                : 'Describe website building or repair problems in Telugu or English'}
            </p>
          </div>
        </div>

        {/* Language Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 border border-white/10 text-xs font-bold text-slate-200 transition-all hover:scale-105"
            title="Switch Language: English / తెలుగు"
          >
            <Globe className="w-3.5 h-3.5 text-accent-cyan" />
            <span>{language === 'en' ? 'తెలుగు (Telugu)' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Live Provider Status Banner */}
      {response?.providerInfo?.setupMessage && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <div className="leading-relaxed">{response.providerInfo.setupMessage}</div>
        </div>
      )}

      {/* Suggested Quick Prompts */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400">
          {language === 'te' ? 'త్వరిత ప్రశ్నలు ఎంచుకోండి:' : 'Try a quick question:'}
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuery(q);
                handleAskAssistant(q);
              }}
              className="text-left text-[11px] px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-750 text-slate-300 border border-white/5 transition-colors line-clamp-1 max-w-md"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAskAssistant();
              }
            }}
            rows={2}
            placeholder={
              language === 'te'
                ? 'మీ వెబ్‌సైట్ లోపాన్ని లేదా రిపేర్ ప్రశ్నను ఇక్కడ రాయండి (ఉదా: నా సైట్ మొబైల్‌లో వెడల్పుగా కనబడుతోంది)...'
                : 'Describe your website repair problem in English or Telugu (e.g., Mobile layout overflows horizontally)...'
            }
            className="w-full bg-dark-900 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-primary-500 resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-500 font-mono">
            {language === 'te' ? 'తెలుగు లిపి మరియు ఆంగ్ల పదాలను గుర్తిస్తుంది' : 'Accepts English & Telugu input'}
          </span>
          <button
            onClick={() => handleAskAssistant()}
            disabled={isLoading || !inputQuery.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg transition-colors"
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{language === 'te' ? 'విశ్లేషించండి' : 'Ask Assistant'}</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Assistant Diagnosis & Repair Plan Output */}
      {response && (
        <div className="rounded-xl border border-white/10 bg-dark-900 p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {/* Analysis Section */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-accent-cyan flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'కారణ విశ్లేషణ (Root Cause Analysis):' : 'Root Cause Analysis:'}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-dark-850 p-3 rounded-xl border border-white/5">
              {response.analysis}
            </p>
          </div>

          {/* Detected Problems */}
          {response.detectedProblems && response.detectedProblems.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'గుర్తించబడిన లోపాలు:' : 'Detected Structural Flaws:'}</span>
              </div>
              <div className="space-y-1.5">
                {response.detectedProblems.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-rose-300">{p.title}</span>
                    <span className="font-mono text-[10px] text-slate-400">{p.location}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Repair Plan */}
          {response.repairPlan && response.repairPlan.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'దశలవారీ రిపేర్ ప్రణాళిక (Repair Plan):' : 'Step-by-Step Repair Plan:'}</span>
              </div>
              <div className="space-y-1.5 bg-dark-850 p-3 rounded-xl border border-white/5">
                {response.repairPlan.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposed Snippet */}
          {response.suggestedFixCode && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-accent-cyan" />
                <span>{language === 'te' ? 'ప్రతిపాదిత కోడ్ దిద్దుబాటు:' : 'Proposed Code Correction:'}</span>
              </div>
              <pre className="p-3 rounded-xl bg-dark-950 border border-white/10 text-emerald-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                {response.suggestedFixCode}
              </pre>
            </div>
          )}

          {/* Action Link to Verified Repair Lab */}
          {onOpenRepairLab && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onOpenRepairLab}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-cyan to-primary-600 hover:from-cyan-400 hover:to-primary-500 text-dark-900 font-extrabold text-xs shadow-md transition-all"
              >
                <span>{language === 'te' ? 'వెరిఫైడ్ రిపేర్ ల్యాబ్‌లో పరిశీలించండి →' : 'Review in Verified Repair Lab →'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
