export class ExplanationAgent {
  constructor() {
    this.role = 'Architectural Explanation Agent';
  }

  explain(project, requirements, repairsApplied = []) {
    const { category, language } = requirements;
    const isTelugu = language === 'te';

    if (isTelugu) {
      return {
        summary: `మీ అభ్యర్థన ఆధారంగా "${project.name}" అనే పూర్తి రెస్పాన్సివ్ వెబ్‌సైట్ రూపొందించబడింది.`,
        keyHighlights: [
          `వర్గం: ${project.category} కు అనుగుణంగా ప్రత్యేక లేఅవుట్ నిర్మాణం`,
          `${project.sections.length} విభిన్న విభాగాలు (నావిగేషన్, హీరో, ఫీచర్లు, ధరలు, సంప్రదింపు)`,
          `రంగుల శైలి: ${project.palette.name} (${project.palette.primary})`,
          `భాష: స్వచ్ఛమైన తెలుగు కంటెంట్ మరియు లేబుల్స్`,
        ],
        nextSteps: [
          'చాట్ అసిస్టెంట్ ద్వారా ఏదైనా విభాగాన్ని సులభంగా మార్చండి',
          'క్వాలిటీ ల్యాబ్‌లో యాక్సెసిబిలిటీ స్కోరును తనిఖీ చేయండి',
          'సోర్స్ కోడ్‌ను ZIP ఫైల్‌గా డౌన్‌లోడ్ చేయండి లేదా గిట్‌హబ్‌లో ప్రచురించండి',
        ],
      };
    }

    return {
      summary: `Synthesized production-ready ${category} web application "${project.name}" based on your natural language prompt.`,
      keyHighlights: [
        `Architectural Category: ${category.toUpperCase()} tailored design system`,
        `Section Composition: ${project.sections.length} semantic sections with WCAG contrast tokens`,
        `Design Palette: ${project.palette.name} (${project.palette.primary}) with dark glassmorphism`,
        `Fluid Typography: ${project.fontFamily} responsive scaling`,
      ],
      repairsNote:
        repairsApplied.length > 0
          ? `Automatic hardening applied: ${repairsApplied.join(', ')}.`
          : 'Zero schema deviations detected during validation audit.',
      nextSteps: [
        'Use the in-app Conversational Copilot to adjust specific headlines or buttons',
        'Review objective accessibility and SEO scores in the Quality Lab',
        'Export as a zero-dependency ZIP archive or publish to GitHub and Vercel',
      ],
    };
  }
}
