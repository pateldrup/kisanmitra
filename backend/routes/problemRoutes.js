const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProblems)
  .post(protect, createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

module.exports = router;
