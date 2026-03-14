const Problem = require('../models/Problem');

// @desc    Get all problems with pagination, search, sorting, filtering
// @route   GET /api/problems
// @access  Public
const getProblems = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { cropType: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const categoryFilter = req.query.category && req.query.category !== 'All'
      ? { cropType: req.query.category }
      : {};

    const query = { ...keyword, ...categoryFilter };

    // Determine sorting
    let sortObj = { createdAt: -1 }; // Default: Newest

    if (req.query.sort === 'oldest') {
        sortObj = { createdAt: 1 };
    }
    // Most helpful could be based on solutions count, but we might just sort by default here
    // as it's a bit complex with a separate solutions collection without aggregation.

    const count = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .populate('createdBy', 'name location')
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      problems,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Public
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('createdBy', 'name email location');

    if (problem) {
      res.json(problem);
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a problem
// @route   POST /api/problems
// @access  Private
const createProblem = async (req, res) => {
  try {
    const { title, description, cropType, image } = req.body;

    const problem = new Problem({
      title,
      description,
      cropType,
      image,
      createdBy: req.user._id,
    });

    const createdProblem = await problem.save();
    res.status(201).json(createdProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a problem
// @route   PUT /api/problems/:id
// @access  Private
const updateProblem = async (req, res) => {
  try {
    const { title, description, cropType, image } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (problem) {
      // Check if user owns the problem
      if (problem.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this problem' });
      }

      problem.title = title || problem.title;
      problem.description = description || problem.description;
      problem.cropType = cropType || problem.cropType;
      problem.image = image || problem.image;

      const updatedProblem = await problem.save();
      res.json(updatedProblem);
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
// @access  Private
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (problem) {
      if (problem.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this problem' });
      }

      await problem.deleteOne();
      res.json({ message: 'Problem removed' });
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
};
