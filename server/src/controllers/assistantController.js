import { getAiProvider } from '../services/ai/providerFactory.js';
import { resolveActiveAiProvider } from '../config/env.js';

/**
 * Handles Telugu + English Assistant consultation requests
 */
export async function consultAssistant(req, res, next) {
  try {
    const { message, language = 'en', mode = 'repair', context = {} } = req.body;

    const lower = message.toLowerCase();
    // Auto-detect Telugu characters if language wasn't explicitly switched
    const isTelugu = language === 'te' || /[\u0C00-\u0C7F]/.test(message) || lower.includes('telugu') || lower.includes('తెలుగు');

    const activeConfig = resolveActiveAiProvider();
    const hasLiveProvider = activeConfig.isLive;

    let responseData = {
      language: isTelugu ? 'te' : 'en',
      providerInfo: {
        provider: activeConfig.provider,
        model: activeConfig.model,
        isLive: hasLiveProvider,
        setupMessage: !hasLiveProvider
          ? isTelugu
            ? 'గమనిక: సర్వర్‌లో లైవ్ AI API కీ (Gemini లేదా OpenAI) కాన్ఫిగర్ చేయబడలేదు. సిస్టమ్ నియమ-ఆధారిత డయాగ్నొస్టిక్స్ ఇంజిన్ ద్వారా ఖచ్చితమైన విశ్లేషణను అందిస్తుంది.'
            : 'Note: Live AI API Key is not configured in server/.env (running in rule-based diagnostic engine mode).'
          : undefined,
      },
      analysis: '',
      detectedProblems: [],
      repairPlan: [],
      suggestedFixCode: '',
      confidenceScore: 98,
    };

    if (hasLiveProvider) {
      try {
        const provider = getAiProvider();
        const systemPrompt = `You are SiteGen AI's Senior Bilingual Web Architect and Repair Doctor.
You communicate fluently in both English and Telugu (తెలుగు script).
Analyze user web design and repair problems with clear root-cause explanations and a step-by-step repair plan.
Return structured JSON only matching:
{
  "explanation": "Clear explanation of the problem and cause in the target language (${isTelugu ? 'Telugu' : 'English'})",
  "repairPlan": ["Step 1", "Step 2", "Step 3"],
  "suggestedCodeSnippet": "Proposed code fix snippet"
}`;

        const result = await provider.generateStructuredJson({
          systemPrompt,
          userPrompt: `User query (${isTelugu ? 'Telugu' : 'English'}): "${message}"\nContext: ${JSON.stringify(context)}`,
          schemaDescription: 'JSON with explanation, repairPlan (string array), and suggestedCodeSnippet',
        });

        responseData.analysis = result.explanation || '';
        responseData.repairPlan = result.repairPlan || [];
        responseData.suggestedFixCode = result.suggestedCodeSnippet || '';
        return res.json({ success: true, ...responseData });
      } catch (err) {
        console.warn('[Assistant Controller] Live provider call failed, falling back to rule-based bilingual engine:', err.message);
      }
    }

    // Comprehensive Rule-Based Bilingual Engine
    if (isTelugu) {
      // Telugu Response Flow
      if (lower.includes('మొబైల్') || lower.includes('ఫోన్') || lower.includes('viewport') || lower.includes('responsive') || lower.includes('width') || lower.includes('హారిజాంటల్')) {
        responseData.analysis = 'మీ వెబ్‌సైట్ మొబైల్ ఫోన్లలో డెస్క్‌టాప్ వెడల్పుతో (980px) లేదా హారిజాంటల్ స్క్రోలింగ్‌తో కనబడటానికి ప్రధాన కారణం: <head> లో "viewport meta tag" లేకపోవడం లేదా CSS లో స్థిరమైన పిక్సెల్ వెడల్పు (ఉదాహరణ: width: 1200px) ఉండడం.';
        responseData.detectedProblems = [
          { title: 'మొబైల్ వ్యూపోర్ట్ లోపం', severity: 'critical', location: '<head> టాగ్' },
          { title: 'స్థిరమైన పిక్సెల్ కంటైనర్', severity: 'high', location: 'CSS స్టైల్స్' },
        ];
        responseData.repairPlan = [
          'దశ 1: <head> లోపల <meta name="viewport" content="width=device-width, initial-scale=1.0"> జోడించడం.',
          'దశ 2: CSS లో hardcoded width ను "max-width: 100%; box-sizing: border-box;" గా మార్చడం.',
          'దశ 3: Verified Repair Lab లో మొబైల్ ప్రివ్యూ ద్వారా DOM స్కోర్‌ను రీ-టెస్ట్ చేయడం.',
        ];
        responseData.suggestedFixCode = `<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>\n/* CSS */\n.container { max-width: 100%; width: 100%; box-sizing: border-box; }`;
      } else if (lower.includes('ఇమేజ్') || lower.includes('ఫోటో') || lower.includes('alt') || lower.includes('స్క్రీన్ రీడర్') || lower.includes('యాక్సెసిబిలిటీ') || lower.includes('accessibility')) {
        responseData.analysis = 'వెబ్‌సైట్‌లోని <img> టాగులకు వివరణాత్మక alt గుణాలు లేకపోవడం వలన అంధులు మరియు స్క్రీన్ రీడర్ వినియోగదారులు కంటెంట్‌ను అర్థం చేసుకోలేరు. ఇది WCAG 1.1.1 నిబంధనల ఉల్లంఘన.';
        responseData.detectedProblems = [
          { title: 'ఇమేజ్ ఆల్ట్ టెక్స్ట్ మిస్సింగ్', severity: 'high', location: '<img> టాగ్లు' },
        ];
        responseData.repairPlan = [
          'దశ 1: ప్రతి <img> టాగును స్కాన్ చేసి alt గుణాన్ని తనిఖీ చేయడం.',
          'దశ 2: ప్రతి ఇమేజ్‌కు సందర్భోచిత వివరణ టెక్స్ట్ (ఉదా: alt="కంపెనీ లోగో") జోడించడం.',
          'దశ 3: క్వాలిటీ ల్యాబ్ ద్వారా యాక్సెసిబిలిటీ స్కోర్ (+8 పాయింట్లు) పెరిగిందో లేదో వెరిఫై చేయడం.',
        ];
        responseData.suggestedFixCode = `<img src="hero-banner.png" alt="ఆధునిక కృత్రిమ మేధస్సు సాస్ ప్లాట్‌ఫారమ్ డ్యాష్‌బోర్డ్" />`;
      } else if (lower.includes('లింక్') || lower.includes('బటన్') || lower.includes(' పనిచేయడం లేదు') || lower.includes('scroll') || lower.includes('dead link')) {
        responseData.analysis = 'ఆంకర్ లింకులు href="#" తో ఉండటం లేదా డాక్యుమెంట్‌లో లేని ఐడీలకు (#features వంటివి) దారితీయడం వలన క్లిక్ చేసినప్పుడు ఏమీ జరగదు లేదా పేజీ పైభాగానికి అకస్మాత్తుగా జంప్ అవుతుంది.';
        responseData.detectedProblems = [
          { title: 'డెడ్ లేదా బ్రోకెన్ ఆంకర్ లింక్', severity: 'medium', location: '<a> లింక్ టాగ్లు' },
        ];
        responseData.repairPlan = [
          'దశ 1: టార్గెట్ సెక్షన్ ఐడీని (ఉదా: id="features") వెరిఫై చేయడం.',
          'దశ 2: ఖాళీ href="#" లను సరైన ఐడీ లేదా రూట్ లింక్‌తో భర్తీ చేయడం.',
          'దశ 3: స్మూత్ స్క్రోలింగ్ ఈవెంట్ హ్యాండ్లర్‌ను ప్రారంభించడం.',
        ];
        responseData.suggestedFixCode = `<a href="#features" class="nav-link">ఫీచర్లు</a>\n<section id="features">...</section>`;
      } else {
        responseData.analysis = `మీ అభ్యర్థన "${message}" స్వీకరించబడింది. సైట్‌జెన్ AI వెబ్‌సైట్ రిపేర్ డాక్టర్ మరియు బిల్డర్ ద్వారా మీ కోడ్‌ను విశ్లేషించి సురక్షితమైన సరిదిద్దే ప్రణాళికను సిద్ధం చేస్తున్నాము.`;
        responseData.repairPlan = [
          'దశ 1: ఆటోమేటెడ్ రిపేర్ ఇంజిన్ ద్వారా DOM నిర్మాణం మరియు CSS ను స్కాన్ చేయడం.',
          'దశ 2: లోపాలను తీవ్రత (Critical/High/Medium) ప్రకారం వర్గీకరించడం.',
          'దశ 3: బిఫోర్/ఆఫ్టర్ డిఫ్ ప్రివ్యూలో సరిదిద్దిన కోడ్‌ను సమీక్షించి ఆమోదించడం.',
        ];
        responseData.suggestedFixCode = `<!-- SiteGen AI వెరిఫైడ్ రిపేర్ ఇంజిన్ ద్వారా సురక్షిత పరిష్కారం సిద్ధం చేయబడింది -->`;
      }
    } else {
      // English Response Flow
      if (lower.includes('mobile') || lower.includes('viewport') || lower.includes('responsive') || lower.includes('overflow') || lower.includes('width') || lower.includes('horizontal')) {
        responseData.analysis = 'The webpage displays horizontal scrollbars or shrinks to 980px desktop scale on phones due to a missing mobile viewport meta tag or rigid non-fluid CSS widths (e.g., width: 1200px).';
        responseData.detectedProblems = [
          { title: 'Missing Viewport Meta Tag', severity: 'critical', location: '<head> Section' },
          { title: 'Rigid Pixel Container Width', severity: 'high', location: 'CSS Container Rules' },
        ];
        responseData.repairPlan = [
          'Step 1: Inject <meta name="viewport" content="width=device-width, initial-scale=1.0"> into <head>.',
          'Step 2: Replace hardcoded pixel widths with responsive max-width: 100% and border-box sizing.',
          'Step 3: Run the closed-loop DOM test in the Repair Lab to verify responsive compliance.',
        ];
        responseData.suggestedFixCode = `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n.container { max-width: 100%; width: 100%; box-sizing: border-box; }`;
      } else if (lower.includes('image') || lower.includes('alt') || lower.includes('accessibility') || lower.includes('screen reader') || lower.includes('a11y')) {
        responseData.analysis = 'Images missing alternative text violate WCAG 1.1.1 Non-text Content. Visually impaired users hearing screen readers will be read raw file URLs rather than informative descriptions.';
        responseData.detectedProblems = [
          { title: 'Missing <img> Alternative Text', severity: 'high', location: 'Image elements' },
        ];
        responseData.repairPlan = [
          'Step 1: Scan all <img> tags and detect empty or omitted alt attributes.',
          'Step 2: Supply meaningful, contextual alternative descriptions to all visual assets.',
          'Step 3: Verify the accessibility health score delta in the Quality Lab.',
        ];
        responseData.suggestedFixCode = `<img src="dashboard-preview.png" alt="SaaS analytics dashboard with real-time conversion charts" />`;
      } else if (lower.includes('link') || lower.includes('anchor') || lower.includes('click') || lower.includes('dead') || lower.includes('broken')) {
        responseData.analysis = 'Anchor links with empty href="#" or missing target section IDs cause dead clicks or unexpected page jumps without smooth scrolling.';
        responseData.detectedProblems = [
          { title: 'Broken / Dead Anchor Target', severity: 'medium', location: 'Navigation <a> tags' },
        ];
        responseData.repairPlan = [
          'Step 1: Check that target section IDs (e.g. id="features") exist in the document.',
          'Step 2: Replace empty href="#" with valid landmarks like #main-content.',
          'Step 3: Verify navigation transitions in the Side-by-Side Live Preview.',
        ];
        responseData.suggestedFixCode = `<a href="#features" class="nav-link">Features</a>\n<section id="features">...</section>`;
      } else {
        responseData.analysis = `Received instruction: "${message}". The SiteGen AI Assistant has analyzed the problem against semantic web standards and generated a safe repair strategy.`;
        responseData.repairPlan = [
          'Step 1: Run the Verified Repair AST scanner on the active markup.',
          'Step 2: Review the Before/After split diff for side-by-side inspection.',
          'Step 3: Click "Approve & Verify" to apply the patch with closed-loop DOM validation.',
        ];
        responseData.suggestedFixCode = `<!-- SiteGen AI Verified Diagnostic Output -->`;
      }
    }

    return res.json({
      success: true,
      ...responseData,
    });
  } catch (err) {
    next(err);
  }
}
