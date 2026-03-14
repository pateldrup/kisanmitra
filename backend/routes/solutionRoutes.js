const express = require('express');
const router = express.Router();
const { addSolution, getSolutions } = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addSolution);

router.route('/:problemId')
  .get(getSolutions);

module.exports = router;
