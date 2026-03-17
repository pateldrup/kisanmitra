const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  toggleLikeProblem,
  toggleBookmarkProblem
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProblemImage } = require('../utils/multer');

router.route('/')
  .get(getProblems)
  .post(protect, uploadProblemImage.single('image'), createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protect, uploadProblemImage.single('image'), updateProblem)
  .delete(protect, deleteProblem);

router.put('/:id/like', protect, toggleLikeProblem);
router.put('/:id/bookmark', protect, toggleBookmarkProblem);

module.exports = router;
