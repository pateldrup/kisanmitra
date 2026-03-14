const Solution = require('../models/Solution');
const Problem = require('../models/Problem');

// @desc    Add a solution to a problem
// @route   POST /api/solutions
// @access  Private
const addSolution = async (req, res) => {
  try {
    const { solutionText, problemId } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const solution = new Solution({
      solutionText,
      problemId,
      postedBy: req.user._id,
    });

    const createdSolution = await solution.save();
    
    // Populate the postedBy field before returning
    await createdSolution.populate('postedBy', 'name');

    res.status(201).json(createdSolution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get solutions for a problem
// @route   GET /api/solutions/:problemId
// @access  Public
const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ problemId: req.params.problemId })
      .populate('postedBy', 'name location')
      .sort({ createdAt: 1 }); // Oldest first (chronological order)

    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSolution,
  getSolutions,
};
