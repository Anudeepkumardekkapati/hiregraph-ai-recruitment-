const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const aiParser = require('../utils/aiParser');

const candidatesFile = path.join(__dirname, '../data/candidates.json');

const loadCandidates = () => {
  const data = fs.readFileSync(candidatesFile, 'utf-8');
  return JSON.parse(data);
};

const saveCandidates = (candidates) => {
  fs.writeFileSync(candidatesFile, JSON.stringify(candidates, null, 2), 'utf-8');
};

const getAllCandidates = (req, res) => {
  const candidates = loadCandidates();
  const publicCandidates = candidates.map(c => ({
    id: c.id,
    displayName: c.displayName,
    email: c.email,
    publicSlug: c.publicSlug,
    completionPct: c.completionPct,
    profileSummary: c.profileSummary,
    topSkills: c.skills.slice(0, 5),
    topProjects: c.projects.slice(0, 3),
    profileVisibility: c.profileVisibility
  }));
  
  res.status(200).json({
    success: true,
    count: publicCandidates.length,
    candidates: publicCandidates
  });
};

const getCandidateById = (req, res) => {
  const { id } = req.params;
  const candidates = loadCandidates();
  const candidate = candidates.find(c => c.id === id);
  
  if (!candidate) {
    return res.status(404).json({ 
      error: 'Candidate not found' 
    });
  }
  
  res.status(200).json({
    success: true,
    candidate: candidate
  });
};

const getCandidateBySlug = (req, res) => {
  const { slug } = req.params;
  const candidates = loadCandidates();
  const candidate = candidates.find(c => c.publicSlug === slug);
  
  if (!candidate) {
    return res.status(404).json({ 
      error: 'Candidate not found' 
    });
  }
  
  res.status(200).json({
    success: true,
    candidate: candidate
  });
};

const createCandidate = (req, res) => {
  const { userId, displayName, email } = req.body;
  
  if (!userId || !displayName || !email) {
    return res.status(400).json({ 
      error: 'userId, displayName, and email are required' 
    });
  }
  
  const candidates = loadCandidates();
  
  const newCandidate = {
    id: `candidate-${uuidv4()}`,
    userId: userId,
    displayName: displayName,
    email: email,
    completionPct: 10,
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
    profileVisibility: 'private',
    publicSlug: `${displayName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    personal: {
      pronouns: '',
      location: { city: '', region: '', country: '' },
      remotePreference: 'hybrid'
    },
    preferences: {
      openTo: [],
      salaryRange: { min: 0, max: 0, currency: 'LPA' },
      noticePeriod: ''
    },
    skills: [],
    projects: [],
    roles: [],
    education: [],
    certifications: [],
    verifications: [],
    profileSummary: ''
  };
  
  candidates.push(newCandidate);
  saveCandidates(candidates);
  
  res.status(201).json({
    success: true,
    message: 'Candidate profile created',
    candidate: newCandidate
  });
};

const parseProjectInput = (req, res) => {
  const { userId, projectText } = req.body;
  
  if (!projectText) {
    return res.status(400).json({ 
      error: 'projectText is required' 
    });
  }
  
  const parsed = aiParser.parseProjectFromText(projectText);
  
  res.status(200).json({
    success: true,
    project: parsed.project,
    followUpQuestions: parsed.followUpQuestions,
    suggestedSkills: aiParser.generateSkillSuggestions(projectText),
    confidence: parsed.project.confidence
  });
};

const addProjectToCandidate = (req, res) => {
  const { candidateId } = req.params;
  const { project } = req.body;
  
  if (!project || !project.title) {
    return res.status(400).json({ 
      error: 'Project data with title is required' 
    });
  }
  
  const candidates = loadCandidates();
  const candidate = candidates.find(c => c.id === candidateId);
  
  if (!candidate) {
    return res.status(404).json({ 
      error: 'Candidate not found' 
    });
  }
  
  const newProject = {
    id: `project-${uuidv4()}`,
    ...project,
    createdAt: new Date().toISOString()
  };
  
  candidate.projects.push(newProject);
  candidate.lastEdited = new Date().toISOString();
  candidate.completionPct = Math.min(candidate.completionPct + 15, 100);
  
  saveCandidates(candidates);
  
  res.status(201).json({
    success: true,
    message: 'Project added successfully',
    project: newProject,
    updatedCompletionPct: candidate.completionPct
  });
};

const addSkillsToCandidate = (req, res) => {
  const { candidateId } = req.params;
  const { skills } = req.body;
  
  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ 
      error: 'Skills array is required' 
    });
  }
  
  const candidates = loadCandidates();
  const candidate = candidates.find(c => c.id === candidateId);
  
  if (!candidate) {
    return res.status(404).json({ 
      error: 'Candidate not found' 
    });
  }
  
  skills.forEach(skill => {
    if (!candidate.skills.some(s => s.name === skill.name)) {
      candidate.skills.push({
        id: `skill-${uuidv4()}`,
        ...skill,
        evidence: [],
        provenance: 'candidate'
      });
    }
  });
  
  candidate.lastEdited = new Date().toISOString();
  candidate.completionPct = Math.min(candidate.completionPct + 10, 100);
  
  saveCandidates(candidates);
  
  res.status(200).json({
    success: true,
    message: 'Skills added successfully',
    skills: candidate.skills,
    updatedCompletionPct: candidate.completionPct
  });
};

const updateCandidateProfile = (req, res) => {
  const { candidateId } = req.params;
  const updates = req.body;
  
  const candidates = loadCandidates();
  const candidate = candidates.find(c => c.id === candidateId);
  
  if (!candidate) {
    return res.status(404).json({ 
      error: 'Candidate not found' 
    });
  }
  
  Object.assign(candidate, updates, {
    lastEdited: new Date().toISOString()
  });
  
  saveCandidates(candidates);
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    candidate: candidate
  });
};

const generateProfileSummary = (req, res) => {
  const { candidateId } = req.params;
  
  const candidates = loadCandidates();
  const candidate = candidates.find(c => c.id === candidateId);
  
  if (!candidate) {
    return res.status(404).json({ 
      error: 'Candidate not found' 
    });
  }
  
  const summary = aiParser.generateProfileSummary(candidate);
  
  candidate.profileSummary = summary;
  candidate.lastEdited = new Date().toISOString();
  
  saveCandidates(candidates);
  
  res.status(200).json({
    success: true,
    summary: summary
  });
};

module.exports = {
  getAllCandidates,
  getCandidateById,
  getCandidateBySlug,
  createCandidate,
  parseProjectInput,
  addProjectToCandidate,
  addSkillsToCandidate,
  updateCandidateProfile,
  generateProfileSummary
};
