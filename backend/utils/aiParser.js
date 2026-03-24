const techStack = {
  frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
  backend: ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'Ruby', 'PHP', 'C#'],
  database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'DynamoDB', 'Elasticsearch'],
  cloud: ['AWS', 'GCP', 'Azure', 'Heroku', 'Vercel', 'Netlify'],
  tools: ['Docker', 'Kubernetes', 'Git', 'Stripe', 'GraphQL', 'REST', 'WebSocket'],
  devops: ['CI/CD', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Terraform', 'CloudFormation']
};

const extractTechnologies = (text) => {
  const allTech = Object.values(techStack).flat();
  const foundTech = [];
  
  allTech.forEach(tech => {
    const regex = new RegExp(`\\b${tech}\\b`, 'gi');
    if (regex.test(text)) {
      foundTech.push(tech);
    }
  });
  
  return [...new Set(foundTech)];
};

const detectMetrics = (text) => {
  const metrics = [];
  
  const percentPattern = /(\d+)%/g;
  const percentMatches = text.matchAll(percentPattern);
  for (const match of percentMatches) {
    metrics.push({
      type: 'percentage',
      value: parseInt(match[1]),
      context: text.substring(Math.max(0, match.index - 20), Math.min(text.length, match.index + 40))
    });
  }
  
  const timePattern = /(\d+)\s*(seconds?|minutes?|hours?|days?|weeks?|months?|years?)/gi;
  const timeMatches = text.matchAll(timePattern);
  for (const match of timeMatches) {
    metrics.push({
      type: 'time',
      value: parseInt(match[1]),
      unit: match[2],
      context: text.substring(Math.max(0, match.index - 20), Math.min(text.length, match.index + 40))
    });
  }
  
  return metrics;
};

const generateFollowUpQuestions = (projectData) => {
  const questions = [];
  
  if (!projectData.metrics || projectData.metrics.length === 0) {
    questions.push('Do you have any quantifiable metrics for this project? (percentage improvement, time reduction, cost savings)');
  }
  
  if (!projectData.teamSize) {
    questions.push('How many people were in your team for this project?');
  }
  
  if (projectData.ownership === undefined || projectData.ownership === null) {
    questions.push('What was your level of ownership? (were you the lead, contributor, or just involved?)');
  }
  
  if (!projectData.tech || projectData.tech.length === 0) {
    questions.push('What technologies did you use to build this?');
  }
  
  return questions.slice(0, 2);
};

const parseProjectFromText = (userInput) => {
  const techs = extractTechnologies(userInput);
  const metrics = detectMetrics(userInput);
  
  const projectTitle = extractProjectTitle(userInput);
  const problem = extractProblem(userInput);
  const approach = extractApproach(userInput);
  
  const project = {
    id: `project-${Date.now()}`,
    title: projectTitle,
    problem: problem,
    approach: approach,
    roleInProject: extractRole(userInput),
    ownership: extractOwnership(userInput),
    teamSize: extractTeamSize(userInput),
    tech: techs,
    metrics: transformMetrics(metrics, userInput),
    evidence: [],
    startDate: null,
    endDate: null,
    provenance: 'ai',
    confidence: calculateConfidence(techs, metrics, problem)
  };
  
  return {
    project: project,
    followUpQuestions: generateFollowUpQuestions(project),
    rawMetrics: metrics
  };
};

const extractProjectTitle = (text) => {
  const titlePatterns = [
    /(?:built|developed|created|shipped|launched|redesigned)\s+(?:the\s+|a\s+)?([^,.\n]+)/i,
    /(?:project|initiative|feature)[\s:]+([^,.\n]+)/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return text.split(/[.,]/)[0].substring(0, 50).trim() || 'Untitled Project';
};

const extractProblem = (text) => {
  const problemPatterns = [
    /(?:problem|issue|challenge|pain point)[\s:]+([^.!?]+)/i,
    /(?:was|caused)\s+([^,.\n]+)\s+(?:issue|problem|challenge)/i,
    /(?:due to|because of)\s+([^,.\n]+)/i
  ];
  
  for (const pattern of problemPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return 'Performance or feature improvement';
};

const extractApproach = (text) => {
  const approachPatterns = [
    /(?:approach|solution|implemented|built)[\s:]+([^.!?]+)/i,
    /(?:used|leveraged|utilized)\s+([^.!?]+)\s+(?:to|for)/i
  ];
  
  for (const pattern of approachPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  
  return 'Technology-driven solution';
};

const extractRole = (text) => {
  if (/\blead\b/i.test(text)) return 'Lead';
  if (/\bowner\b/i.test(text)) return 'Owner';
  if (/\barchitect/i.test(text)) return 'Architect';
  if (/\bcontribut/i.test(text)) return 'Contributor';
  return 'Team Member';
};

const extractOwnership = (text) => {
  if (/\blead\b/i.test(text)) return 0.8;
  if (/\bowner\b/i.test(text)) return 0.9;
  if (/\bco-lead|co-owner/i.test(text)) return 0.6;
  if (/\bcontribut/i.test(text)) return 0.4;
  return 0.5;
};

const extractTeamSize = (text) => {
  const sizePattern = /(?:team size|with|in a team of)\s+(\d+)\s+(?:people|members|engineers)/i;
  const match = text.match(sizePattern);
  return match ? parseInt(match[1]) : null;
};

const transformMetrics = (metrics, text) => {
  return metrics.map((metric, idx) => {
    if (metric.type === 'percentage') {
      return {
        name: inferMetricName(metric.context),
        value: metric.value,
        unit: 'percent',
        improvementPct: metric.value,
        evidence: 'user-provided'
      };
    }
    return null;
  }).filter(m => m !== null);
};

const inferMetricName = (context) => {
  if (/latency|load time|performance|speed/i.test(context)) return 'latency';
  if (/conversion|revenue|sales/i.test(context)) return 'conversionRate';
  if (/user|engagement|retention/i.test(context)) return 'userRetention';
  if (/error|failure|bug/i.test(context)) return 'failureRate';
  return 'improvement';
};

const calculateConfidence = (techs, metrics, problem) => {
  let score = 0.5;
  if (techs.length > 0) score += 0.2;
  if (metrics.length > 0) score += 0.2;
  if (problem && problem.length > 10) score += 0.1;
  return Math.min(score, 1.0);
};

const generateSkillSuggestions = (text, existingSkills = []) => {
  const techs = extractTechnologies(text);
  const skillTaxonomy = {
    'React': { category: 'frontend', level: 3 },
    'Vue.js': { category: 'frontend', level: 3 },
    'Node.js': { category: 'backend', level: 3 },
    'Python': { category: 'backend', level: 3 },
    'GraphQL': { category: 'backend', level: 2 },
    'PostgreSQL': { category: 'database', level: 2 },
    'MongoDB': { category: 'database', level: 2 },
    'AWS': { category: 'cloud', level: 2 },
    'Docker': { category: 'devops', level: 2 },
    'Stripe': { category: 'integrations', level: 2 }
  };
  
  const suggestions = techs
    .filter(tech => !existingSkills.some(s => s.name === tech))
    .map(tech => ({
      name: tech,
      suggestedLevel: skillTaxonomy[tech]?.level || 2,
      category: skillTaxonomy[tech]?.category || 'other',
      confidence: 0.8
    }))
    .slice(0, 5);
  
  return suggestions;
};

const generateProfileSummary = (candidate) => {
  const skillNames = candidate.skills.map(s => s.name).slice(0, 5).join(', ');
  const totalOwnership = candidate.projects.reduce((sum, p) => sum + (p.ownership || 0), 0);
  const avgOwnership = (totalOwnership / Math.max(candidate.projects.length, 1) * 100).toFixed(0);
  
  const topMetric = candidate.projects
    .flatMap(p => p.metrics || [])
    .sort((a, b) => (b.improvementPct || 0) - (a.improvementPct || 0))[0];
  
  const yearsExp = candidate.roles ? candidate.roles.length : 0;
  
  return `${yearsExp}+ years experience with ${skillNames}. Proven track record: ${topMetric ? topMetric.improvementPct + '% improvement' : 'shipped 3+ projects'}. Average ownership: ${avgOwnership}%. Impact-driven engineer with focus on scalable systems.`;
};

module.exports = {
  parseProjectFromText,
  generateSkillSuggestions,
  generateProfileSummary,
  generateFollowUpQuestions,
  extractTechnologies,
  detectMetrics
};
