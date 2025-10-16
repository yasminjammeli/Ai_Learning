const express = require('express');
const { askQuestion, generateQuiz } = require('../controllers/aiController');


const router = express.Router();
router.post('/ask', askQuestion);
router.post('/quiz', generateQuiz);

module.exports = router;