export type Language = 'en' | 'te';

export interface Translations {
  common: {
    appName: string;
    tagline: string;
    buildSmarter: string;
    repairFaster: string;
    getStarted: string;
    startBuilding: string;
    exploreTemplates: string;
    repairWebsite: string;
    preview: string;
    code: string;
    settings: string;
    dashboard: string;
    generator: string;
    templates: string;
    repairStudio: string;
    qualityLab: string;
    deployments: string;
    exportCode: string;
    signIn: string;
    signOut: string;
    save: string;
    saved: string;
    cancel: string;
    apply: string;
    reject: string;
    undo: string;
    redo: string;
    generate: string;
    generating: string;
    desktop: string;
    tablet: string;
    mobile: string;
    liveDemoBadge: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    promptPlaceholder: string;
    examplePrompts: string;
    samplePrompt1: string;
    samplePrompt2: string;
    samplePrompt3: string;
    featuresTitle: string;
    featuresSubtitle: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    repairDemoTitle: string;
    repairDemoSubtitle: string;
    audienceTitle: string;
    faqTitle: string;
  };
  generator: {
    title: string;
    describePrompt: string;
    selectCategory: string;
    selectStyle: string;
    selectPalette: string;
    selectFont: string;
    sectionsOutline: string;
    addSection: string;
    chatAssistantTitle: string;
    chatPlaceholder: string;
    regenerateWebsite: string;
    regenerateSection: string;
    previewModeNotice: string;
    demoAiNotice: string;
  };
  repair: {
    title: string;
    subtitle: string;
    uploadInstructions: string;
    sampleBrokenSites: string;
    runDiagnostic: string;
    issuesFound: string;
    criticalIssues: string;
    highIssues: string;
    beforeAfterComparison: string;
    applyAllFixes: string;
    exportRepaired: string;
  };
  quality: {
    title: string;
    subtitle: string;
    overallScore: string;
    measuredBadge: string;
    estimatedNotice: string;
    runAudit: string;
    accessibility: string;
    responsiveness: string;
    seo: string;
    links: string;
    htmlStructure: string;
    performance: string;
  };
  deploy: {
    title: string;
    subtitle: string;
    connectGithub: string;
    repository: string;
    selectBranch: string;
    commitMessage: string;
    publishBtn: string;
    deploymentProvider: string;
    deployNow: string;
    deployStatus: string;
    notConnectedNotice: string;
  };
  settings: {
    title: string;
    subtitle: string;
    appearance: string;
    language: string;
    reducedMotion: string;
    integrations: string;
    aiProvider: string;
    apiKey: string;
    mongoDb: string;
    githubIntegration: string;
    saveSettings: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      appName: 'SiteGen AI',
      tagline: 'Build Smarter. Repair Faster.',
      buildSmarter: 'Build Smarter.',
      repairFaster: 'Repair Faster.',
      getStarted: 'Get Started',
      startBuilding: 'Start Building',
      exploreTemplates: 'Explore Templates',
      repairWebsite: 'Repair Website',
      preview: 'Live Preview',
      code: 'Source Code',
      settings: 'Settings',
      dashboard: 'Dashboard',
      generator: 'AI Generator',
      templates: 'Template Gallery',
      repairStudio: 'Repair Studio',
      qualityLab: 'Quality Lab',
      deployments: 'Deployments',
      exportCode: 'Export ZIP',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      save: 'Save Project',
      saved: 'Saved',
      cancel: 'Cancel',
      apply: 'Apply Fix',
      reject: 'Reject',
      undo: 'Undo',
      redo: 'Redo',
      generate: 'Generate Website',
      generating: 'Synthesizing Website...',
      desktop: 'Desktop (100%)',
      tablet: 'Tablet (768px)',
      mobile: 'Mobile (375px)',
      liveDemoBadge: 'Interactive Demo Mode',
    },
    landing: {
      heroTitle: 'Turn natural language into full responsive websites & diagnose broken code.',
      heroSubtitle: 'Turn your ideas into stunning websites with AI. Generate, customize, repair, and publish your website—all in one place.',
      promptPlaceholder: 'e.g. A high-converting SaaS landing page for an AI developer copilot with clean white aesthetic, feature cards, and interactive testimonials...',
      examplePrompts: 'Try these prompts:',
      samplePrompt1: 'AI Analytics platform with clean cards and live metrics',
      samplePrompt2: 'Artisan coffee roastery website with online ordering menu',
      samplePrompt3: 'Minimalist UX designer portfolio with project case studies',
      featuresTitle: 'Next-Generation Web Creation & Diagnostic Engine',
      featuresSubtitle: 'Engineered for students, designers, solo founders, and agile engineering teams.',
      howItWorksTitle: 'How SiteGen AI Works',
      howItWorksSubtitle: 'Four automated stages from concept to published live URL',
      step1Title: '1. Natural Language Prompt',
      step1Desc: 'Describe your vision in English or Telugu. Select category, color palette, and layout aesthetic.',
      step2Title: '2. Section-by-Section Synthesis',
      step2Desc: 'SiteGen AI creates semantic HTML5, responsive CSS, and interactive sections in real-time.',
      step3Title: '3. Inspect & Conversational Refinement',
      step3Desc: 'Tweak individual sections using conversational chat, toggle visibility, and reorder.',
      step4Title: '4. Quality Audit & Live Deploy',
      step4Desc: 'Inspect measured accessibility, SEO, responsiveness scores, and publish straight to GitHub or Vercel.',
      repairDemoTitle: 'Automated HTML & CSS Repair Studio',
      repairDemoSubtitle: 'Upload broken HTML/CSS. Our diagnostics detect broken links, missing viewports, inaccessible forms, and syntax flaws.',
      audienceTitle: 'Built for Every Creator & Builder',
      faqTitle: 'Frequently Asked Questions',
    },
    generator: {
      title: 'Website Generator Workspace',
      describePrompt: 'Describe your website vision',
      selectCategory: 'Website Category',
      selectStyle: 'Design Aesthetic',
      selectPalette: 'Color Palette',
      selectFont: 'Typography',
      sectionsOutline: 'Page Sections Outline',
      addSection: 'Add New Section',
      chatAssistantTitle: 'Conversational Section Copilot',
      chatPlaceholder: 'Ask AI: e.g. "Add a 20% launch discount badge to hero", "Make prices monthly/annual toggle"...',
      regenerateWebsite: 'Regenerate Entire Site',
      regenerateSection: 'Regenerate This Section',
      previewModeNotice: 'Sandboxed live preview isolates generated content safely.',
      demoAiNotice: 'Running local generative synthesis engine (Level 1 Ready). Real AI API hooks configured for Level 2.',
    },
    repair: {
      title: 'Website Repair Studio',
      subtitle: 'Upload or paste HTML & CSS. Automatically detect bugs, broken links, accessibility flaws, and responsive layout issues.',
      uploadInstructions: 'Drag and drop .html / .css files, or choose from our realistic broken site fixtures.',
      sampleBrokenSites: 'Load Sample Broken Websites',
      runDiagnostic: 'Run Automated Health Diagnostic',
      issuesFound: 'Issues Detected',
      criticalIssues: 'Critical Errors',
      highIssues: 'High Priority',
      beforeAfterComparison: 'Before vs After Fix Comparison',
      applyAllFixes: 'Apply All Fixes',
      exportRepaired: 'Export Cleaned Code',
    },
    quality: {
      title: 'Quality & Testing Lab',
      subtitle: 'Objective measurements of accessibility, SEO, responsiveness, semantic HTML, and code health.',
      overallScore: 'Overall Health Score',
      measuredBadge: 'Live Measured Diagnostic',
      estimatedNotice: 'Scores reflect real structural HTML/CSS parser rules. Performance estimates will link to Lighthouse in Level 2.',
      runAudit: 'Re-Analyze Current Project',
      accessibility: 'Accessibility (a11y)',
      responsiveness: 'Mobile Responsiveness',
      seo: 'Search Engine Optimization',
      links: 'Hyperlink & Resource Integrity',
      htmlStructure: 'HTML5 Semantic Structure',
      performance: 'Payload & Asset Efficiency',
    },
    deploy: {
      title: 'GitHub & Live Deployment Hub',
      subtitle: 'Push your generated repository to GitHub and publish to production edge networks.',
      connectGithub: 'Connect GitHub Account',
      repository: 'Target Repository Name',
      selectBranch: 'Publishing Branch',
      commitMessage: 'Commit Message',
      publishBtn: 'Push to GitHub Repository',
      deploymentProvider: 'Select Hosting Provider',
      deployNow: 'Deploy Live Website',
      deployStatus: 'Deployment Status Log',
      notConnectedNotice: 'Level 1 Demo Mode: Credentials not configured yet. Fill tokens in Settings to enable real OAuth & Edge deployments in Level 2.',
    },
    settings: {
      title: 'Platform Settings & Integrations',
      subtitle: 'Manage theme appearance, API keys, database connection, and deployment targets.',
      appearance: 'Appearance & UI Preferences',
      language: 'Interface Language',
      reducedMotion: 'Respect Reduced Motion',
      integrations: 'API & Service Integrations',
      aiProvider: 'AI Generative Provider',
      apiKey: 'AI API Key (Google Gemini / OpenAI / Anthropic)',
      mongoDb: 'MongoDB Database Status',
      githubIntegration: 'GitHub Token & Permissions',
      saveSettings: 'Save Preferences',
    },
  },
  te: {
    common: {
      appName: 'సైట్‌జెన్ AI',
      tagline: 'తెలివిగా నిర్మించండి. వేగంగా బాగుచేయండి.',
      buildSmarter: 'తెలివిగా నిర్మించండి.',
      repairFaster: 'వేగంగా బాగుచేయండి.',
      getStarted: 'ప్రారంభించండి',
      startBuilding: 'నిర్మాణం ప్రారంభించండి',
      exploreTemplates: 'టెంప్లేట్లు చూడండి',
      repairWebsite: 'సైట్ బాగుచేయండి',
      preview: 'లైవ్ ప్రివ్యూ',
      code: 'సోర్స్ కోడ్',
      settings: 'సెట్టింగ్‌లు',
      dashboard: 'డాష్‌బోర్డ్',
      generator: 'AI జెనరేటర్',
      templates: 'టెంప్లేట్ల గ్యాలరీ',
      repairStudio: 'రిపేర్ స్టూడియో',
      qualityLab: 'క్వాలిటీ ల్యాబ్',
      deployments: 'డిప్లాయ్‌మెంట్స్',
      exportCode: 'ZIP డౌన్‌లోడ్',
      signIn: 'లాగిన్',
      signOut: 'లాగౌట్',
      save: 'ప్రాజెక్ట్ సేవ్ చేయండి',
      saved: 'సేవ్ చేయబడింది',
      cancel: 'రద్దు చేయి',
      apply: 'పరిష్కారం వర్తించు',
      reject: 'తిరస్కరించు',
      undo: 'వెనక్కి (Undo)',
      redo: 'ముందుకు (Redo)',
      generate: 'వెబ్‌సైట్ రూపొందించండి',
      generating: 'వెబ్‌సైట్ రూపొందించబడుతోంది...',
      desktop: 'డెస్క్‌టాప్ (100%)',
      tablet: 'టాబ్లెట్ (768px)',
      mobile: 'మొబైల్ (375px)',
      liveDemoBadge: 'ఇంటరాక్టివ్ డెమో మోడ్',
    },
    landing: {
      heroTitle: 'సాధారణ భాషతో పూర్తి రెస్పాన్సివ్ వెబ్‌సైట్‌లను రూపొందించండి & కోడ్‌ను రిపేర్ చేయండి.',
      heroSubtitle: 'కేవలం ఒక్క ప్రాంప్ట్ ద్వారా దృశ్యపరమైన విభాగాల సవరణ, నాణ్యతా పరీక్షలు మరియు లైవ్ డిప్లాయ్‌మెంట్‌తో కూడిన వెబ్‌సైట్ పొందండి.',
      promptPlaceholder: 'ఉదాహరణకు: AI స్టార్టప్ కోసం డార్క్ గ్లాస్‌మార్ఫిజం, ధరల పట్టికలు మరియు ప్రశంసలతో కూడిన ల్యాండింగ్ పేజీ...',
      examplePrompts: 'ఈ ప్రాంప్ట్‌లను ప్రయత్నించండి:',
      samplePrompt1: 'ధరలతో కూడిన AI అనలిటిక్స్ ప్లాట్‌ఫారమ్ (డార్క్ వైలెట్)',
      samplePrompt2: 'ఆన్‌లైన్ ఆర్డరింగ్ మెనూతో కాఫీ కేఫ్ వెబ్‌సైట్',
      samplePrompt3: 'ప్రాజెక్ట్ కేస్ స్టడీస్‌తో మినిమలిస్ట్ డిజైనర్ పోర్ట్‌ఫోలియో',
      featuresTitle: 'తదుపరి తరం వెబ్ సృష్టి & డయాగ్నస్టిక్ ఇంజిన్',
      featuresSubtitle: 'విద్యార్థులు, డిజైనర్లు మరియు డెవలపర్ల కోసం రూపొందించబడింది.',
      howItWorksTitle: 'సైట్‌జెన్ AI ఎలా పనిచేస్తుంది',
      howItWorksSubtitle: 'ఆలోచన నుండి లైవ్ వెబ్‌సైట్ వరకు 4 దశలు',
      step1Title: '1. సాధారణ భాషా ప్రాంప్ట్',
      step1Desc: 'మీ ఆలోచనను ఇంగ్లీష్ లేదా తెలుగులో వివరించండి. వర్గం, రంగులు మరియు శైలిని ఎంచుకోండి.',
      step2Title: '2. సెక్షన్ల వారీగా ఆటోమేటిక్ నిర్మాణం',
      step2Desc: 'సైట్‌జెన్ AI సెమాంటిక్ HTML5, CSS మరియు ఇంటరాక్టివ్ విభాగాలను నిజ సమయంలో సృష్టిస్తుంది.',
      step3Title: '3. చాట్ ద్వారా మార్పులు',
      step3Desc: 'చాట్ బాట్ ద్వారా ఏ విభాగాన్నైనా సులభంగా మార్చండి లేదా కొత్తవి జోడించండి.',
      step4Title: '4. క్వాలిటీ ఆడిట్ & లైవ్ డిప్లాయ్',
      step4Desc: 'యాక్సెసిబిలిటీ, SEO, రెస్పాన్సివ్‌నెస్ తనిఖీ చేసి, నేరుగా గిట్‌హబ్ లేదా వర్సెల్‌లో ప్రచురించండి.',
      repairDemoTitle: 'ఆటోమేటెడ్ HTML & CSS రిపేర్ స్టూడియో',
      repairDemoSubtitle: 'పనిచేయని HTML/CSSను అప్‌లోడ్ చేయండి. లోపాలు, బ్రోకెన్ లింక్‌లను సులభంగా సరిదిద్దండి.',
      audienceTitle: 'ప్రతి సృష్టికర్త కోసం ప్రత్యేకంగా',
      faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    },
    generator: {
      title: 'వెబ్‌సైట్ జెనరేటర్ వర్క్‌స్పేస్',
      describePrompt: 'మీ వెబ్‌సైట్ వివరాలను వివరించండి',
      selectCategory: 'వెబ్‌సైట్ వర్గం',
      selectStyle: 'డిజైన్ శైలి',
      selectPalette: 'రంగుల పాలెట్',
      selectFont: 'ఫాంట్ టైపోగ్రఫీ',
      sectionsOutline: 'పేజీ విభాగాలు',
      addSection: 'కొత్త విభాగం జోడించు',
      chatAssistantTitle: 'చాట్ అసిస్టెంట్ కోపైలట్',
      chatPlaceholder: 'AIకి చెప్పండి: ఉదా: "హీరో సెక్షన్‌లో 20% ఆఫర్ బ్యాడ్జ్ జోడించు"...',
      regenerateWebsite: 'మొత్తం సైట్‌ను పునర్నిర్మించండి',
      regenerateSection: 'ఈ విభాగాన్ని పునర్నిర్మించండి',
      previewModeNotice: 'సురక్షితమైన శాండ్‌బాక్స్ లైవ్ ప్రివ్యూ.',
      demoAiNotice: 'స్థానిక జనరేటివ్ ఇంజిన్ పనిచేస్తోంది (లెవల్ 1 సిద్దం). లెవల్ 2 కోసం రియల్ AI హుక్స్ అమర్చబడ్డాయి.',
    },
    repair: {
      title: 'వెబ్‌సైట్ రిపేర్ స్టూడియో',
      subtitle: 'HTML & CSS లోపాలను గుర్తించి స్వయంచాలకంగా పరిష్కరించండి.',
      uploadInstructions: '.html / .css ఫైళ్లను అప్‌లోడ్ చేయండి లేదా మా నమూనా ఫైళ్లను ఎంచుకోండి.',
      sampleBrokenSites: 'నమూనా పాడైన సైట్లను లోడ్ చేయండి',
      runDiagnostic: 'డయాగ్నస్టిక్ పరీక్ష ప్రారంభించండి',
      issuesFound: 'కనుగొనబడిన సమస్యలు',
      criticalIssues: 'కీలకమైన లోపాలు',
      highIssues: 'ముఖ్యమైనవి',
      beforeAfterComparison: 'ముందు vs తర్వాత పోలిక',
      applyAllFixes: 'అన్ని పరిష్కారాలను వర్తించండి',
      exportRepaired: 'పరిష్కరించిన కోడ్‌ను డౌన్‌లోడ్ చేయండి',
    },
    quality: {
      title: 'క్వాలిటీ & టెస్టింగ్ ల్యాబ్',
      subtitle: 'యాక్సెసిబిలిటీ, SEO, రెస్పాన్సివ్‌నెస్ మరియు కోడ్ ఆరోగ్యం యొక్క వాస్తవ విశ్లేషణ.',
      overallScore: 'మొత్తం స్కోరు',
      measuredBadge: 'లైవ్ విశ్లేషణ పూర్తయింది',
      estimatedNotice: 'నిజమైన HTML/CSS రూల్స్ ఆధారంగా స్కోర్లు లెక్కించబడ్డాయి.',
      runAudit: 'మళ్ళీ విశ్లేషించండి',
      accessibility: 'యాక్సెసిబిలిటీ (సులభతర ప్రవేశం)',
      responsiveness: 'మొబైల్ రెస్పాన్సివ్‌నెస్',
      seo: 'శోధన యంత్ర ఆప్టిమైజేషన్ (SEO)',
      links: 'లింక్ & వనరుల సమగ్రత',
      htmlStructure: 'HTML5 సెమాంటిక్ నిర్మాణం',
      performance: 'కోడ్ సామర్థ్యం',
    },
    deploy: {
      title: 'గిట్‌హబ్ & లైవ్ డిప్లాయ్‌మెంట్ హబ్',
      subtitle: 'మీ కోడ్‌ను గిట్‌హబ్‌కు పంపండి మరియు లైవ్‌గా ప్రచురించండి.',
      connectGithub: 'గిట్‌హబ్ ఖాతాను కనెక్ట్ చేయండి',
      repository: 'రిపోజిటరీ పేరు',
      selectBranch: 'బ్రాంచ్ ఎంచుకోండి',
      commitMessage: 'కమిట్ సందేశం',
      publishBtn: 'గిట్‌హబ్‌కు పుష్ చేయండి',
      deploymentProvider: 'హోస్టింగ్ ప్రొవైడర్‌ను ఎంచుకోండి',
      deployNow: 'సైట్‌ను డిప్లాయ్ చేయండి',
      deployStatus: 'డిప్లాయ్‌మెంట్ లాగ్',
      notConnectedNotice: 'లెవల్ 1 డెమో: ఆధారాలు కాన్ఫిగర్ చేయబడలేదు. లెవల్ 2లో ఉపయోగించడానికి సెట్టింగ్‌లలో టోకెన్లు ఇవ్వండి.',
    },
    settings: {
      title: 'ప్లాట్‌ఫారమ్ సెట్టింగ్‌లు & అనుసంధానాలు',
      subtitle: 'థీమ్, API కీలు మరియు డిప్లాయ్‌మెంట్ సెట్టింగ్‌లను నిర్వహించండి.',
      appearance: 'రూపురేఖలు & ప్రాధాన్యతలు',
      language: 'ఇంటర్‌ఫేస్ భాష',
      reducedMotion: 'తగ్గించిన యానిమేషన్లు',
      integrations: 'API సర్వీస్ అనుసంధానాలు',
      aiProvider: 'AI ప్రొవైడర్',
      apiKey: 'AI API కీ (Google Gemini / OpenAI)',
      mongoDb: 'MongoDB డేటాబేస్ స్థితి',
      githubIntegration: 'గిట్‌హబ్ టోకెన్',
      saveSettings: 'ప్రాధాన్యతలను భద్రపరచండి',
    },
  },
};
