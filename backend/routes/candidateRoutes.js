const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.get('/public/:slug', candidateController.getCandidateBySlug);
router.post('/', candidateController.createCandidate);
router.post('/parse-project', candidateController.parseProjectInput);
router.post('/:candidateId/projects', candidateController.addProjectToCandidate);
router.post('/:candidateId/skills', candidateController.addSkillsToCandidate);
router.patch('/:candidateId', candidateController.updateCandidateProfile);
router.post('/:candidateId/generate-summary', candidateController.generateProfileSummary);

module.exports = router;
