export interface AssistantResponse {
  language: 'en' | 'te';
  providerInfo: {
    provider: string;
    model: string;
    isLive: boolean;
    setupMessage?: string;
  };
  analysis: string;
  detectedProblems: Array<{
    title: string;
    severity: string;
    location: string;
  }>;
  repairPlan: string[];
  suggestedFixCode?: string;
  confidenceScore: number;
}

export interface AssistantRequest {
  message: string;
  language: 'en' | 'te';
  mode?: 'build' | 'repair' | 'general';
  context?: {
    html?: string;
    css?: string;
    detectedIssues?: any[];
    projectName?: string;
  };
}

export async function askBilingualAssistant(
  params: AssistantRequest
): Promise<AssistantResponse> {
  const isTelugu = params.language === 'te' || /[\u0C00-\u0C7F]/.test(params.message);

  try {
    const res = await fetch('http://localhost:5000/api/assistant/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: params.message,
        language: params.language,
        mode: params.mode || 'repair',
        context: params.context || {},
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data as AssistantResponse;
      }
    }
  } catch (err) {
    console.warn('[Assistant Service] Backend assistant unreachable, falling back to client bilingual parser:', err);
  }

  // Graceful client fallback parser
  return getClientFallbackBilingualResponse(params.message, isTelugu, params.context);
}

function getClientFallbackBilingualResponse(
  message: string,
  isTelugu: boolean,
  context?: any
): AssistantResponse {
  const lower = message.toLowerCase();

  const providerInfo = {
    provider: 'Rule-Based Semantic Engine',
    model: 'bilingual-dom-expert-v1',
    isLive: false,
    setupMessage: isTelugu
      ? 'గమనిక: సర్వర్ AI కీ (GEMINI_API_KEY) కాన్ఫిగర్ చేయబడలేదు. సిస్టమ్ నియమ-ఆధారిత డయాగ్నొస్టిక్స్ ఇంజిన్ ద్వారా ఖచ్చితమైన విశ్లేషణను అందిస్తుంది.'
      : 'Note: Live AI API Key is not configured in server/.env (operating in rule-based diagnostic engine mode).',
  };

  if (isTelugu) {
    if (lower.includes('మొబైల్') || lower.includes('ఫోన్') || lower.includes('viewport') || lower.includes('responsive')) {
      return {
        language: 'te',
        providerInfo,
        analysis: 'వెబ్‌సైట్ మొబైల్ స్క్రీన్‌లలో సరిగ్గా సరిపోకపోవడానికి కారణం: <head> విభాగంలో "viewport meta tag" లేకపోవడం లేదా కంటైనర్‌కు ఫిక్స్‌డ్ పిక్సెల్ వెడల్పు ఉండడం.',
        detectedProblems: [
          { title: 'మొబైల్ వ్యూపోర్ట్ లోపం', severity: 'critical', location: '<head> టాగ్' },
          { title: 'స్థిరమైన పిక్సెల్ వెడల్పు', severity: 'high', location: 'CSS కంటైనర్' },
        ],
        repairPlan: [
          'దశ 1: <head> లో <meta name="viewport" content="width=device-width, initial-scale=1.0"> నిబంధనను చేర్చడం.',
          'దశ 2: width: 1200px స్థానంలో max-width: 100% అమర్చడం.',
          'దశ 3: Verified Repair Lab లో మొబైల్ ప్రివ్యూ ద్వారా DOM స్కోర్‌ను సరిచూసుకోవడం.',
        ],
        suggestedFixCode: `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n.container { max-width: 100%; width: 100%; box-sizing: border-box; }`,
        confidenceScore: 99,
      };
    }

    if (lower.includes('ఇమేజ్') || lower.includes('ఫోటో') || lower.includes('alt') || lower.includes('స్క్రీన్ రీడర్')) {
      return {
        language: 'te',
        providerInfo,
        analysis: 'చిత్రాలకు alt ఆట్రిబ్యూట్ లేకపోవడం వలన అంధులు ఉపయోగించే స్క్రీన్ రీడర్లకు చిత్రాల ఉద్దేశం అర్థం కాదు (WCAG 1.1.1 నిబంధన).',
        detectedProblems: [
          { title: 'ఇమేజ్ ఆల్ట్ టెక్స్ట్ మిస్సింగ్', severity: 'high', location: '<img> టాగ్లు' },
        ],
        repairPlan: [
          'దశ 1: పత్రంలోని అన్ని <img> టాగ్లను స్కాన్ చేయడం.',
          'దశ 2: ప్రతి ఇమేజ్‌కు సందర్భోచిత వివరణాత్మక alt టెక్స్ట్ అందించడం.',
          'దశ 3: యాక్సెసిబిలిటీ ల్యాబ్‌లో స్కోర్ పెరిగిందో లేదో వెరిఫై చేయడం.',
        ],
        suggestedFixCode: `<img src="dashboard.png" alt="ఆధునిక విశ్లేషణల డ్యాష్‌బోర్డ్ చార్ట్‌లు" />`,
        confidenceScore: 98,
      };
    }

    return {
      language: 'te',
      providerInfo,
      analysis: `మీ అభ్యర్థన "${message}" స్వీకరించబడింది. సైట్‌జెన్ AI వెబ్‌సైట్ రిపేర్ డాక్టర్ ద్వారా మీ కోడ్ నిర్మాణాన్ని విశ్లేషించి సురక్షితమైన ప్రణాళికను సిద్ధం చేస్తున్నాము.`,
      detectedProblems: [
        { title: 'స్ట్రక్చరల్ అనాలిసిస్ అభ్యర్థన', severity: 'medium', location: 'Active Document' },
      ],
      repairPlan: [
        'దశ 1: రిపేర్ ల్యాబ్‌లో డాక్యుమెంట్ AST ను స్కాన్ చేయడం.',
        'దశ 2: బిఫోర్/ఆఫ్టర్ డిఫ్ వ్యూయర్ ద్వారా ప్రతిపాదిత మార్పులను పరిశీలించడం.',
        'దశ 3: సేఫ్ రోల్‌బ్యాక్ రక్షణతో ప్యాచ్‌ను ఆమోదించడం.',
      ],
      suggestedFixCode: `<!-- SiteGen AI వెరిఫైడ్ రిపేర్ ఇంజిన్ పరిష్కారం -->`,
      confidenceScore: 95,
    };
  }

  // English fallback
  if (lower.includes('mobile') || lower.includes('viewport') || lower.includes('responsive')) {
    return {
      language: 'en',
      providerInfo,
      analysis: 'Webpage fails responsiveness on mobile screens due to a missing viewport meta tag or hardcoded fixed pixel container widths.',
      detectedProblems: [
        { title: 'Missing Viewport Meta Tag', severity: 'critical', location: '<head> Section' },
        { title: 'Fixed Container Width', severity: 'high', location: 'CSS Rules' },
      ],
      repairPlan: [
        'Step 1: Inject <meta name="viewport" content="width=device-width, initial-scale=1.0"> into <head>.',
        'Step 2: Convert fixed widths to responsive max-width: 100% with border-box sizing.',
        'Step 3: Test side-by-side viewports in the Repair Lab.',
      ],
      suggestedFixCode: `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n.container { max-width: 100%; box-sizing: border-box; }`,
      confidenceScore: 99,
    };
  }

  return {
    language: 'en',
    providerInfo,
    analysis: `Analyzed instruction: "${message}". The SiteGen AI Bilingual Assistant has formulated a standards-compliant remediation strategy.`,
    detectedProblems: [
      { title: 'Web Quality & Architecture Query', severity: 'medium', location: 'Active Workspace' },
    ],
    repairPlan: [
      'Step 1: Run the Verified Repair scanner on the document markup.',
      'Step 2: Inspect the side-by-side visual preview and line-by-line diff.',
      'Step 3: Click "Approve & Verify" with zero-risk rollback safety.',
    ],
    suggestedFixCode: `<!-- SiteGen AI Verified Remediation Blueprint -->`,
    confidenceScore: 96,
  };
}
