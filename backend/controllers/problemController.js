const Problem = require('../models/Problem');
const fs = require('fs');
const path = require('path');

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
            { location: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const categoryFilter = req.query.category && req.query.category !== 'All'
      ? { cropType: req.query.category }
      : {};

    const locationFilter = req.query.location && req.query.location !== 'All'
      ? { location: { $regex: req.query.location, $options: 'i' } }
      : {};

    const query = { ...keyword, ...categoryFilter, ...locationFilter };

    // Determine sorting
    let sortObj = { createdAt: -1 }; // Default: Newest

    if (req.query.sort === 'oldest') {
        sortObj = { createdAt: 1 };
    }

    const count = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .populate('createdBy', 'name location')
      .populate('likes', 'name')
      .populate('bookmarks', 'name')
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Populate solutions count (if we had a virtual or aggregation, simpler way for now: just return the problem. More complex to add solutions count dynamically without aggregation, but frontend can manage or we fetch it via another endpoint or let it be for now.)
    
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
      .populate('createdBy', 'name email location')
      .populate('likes', 'name')
      .populate('bookmarks', 'name');

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
    const { title, description, cropType, location } = req.body;
    let imageUrl = req.body.image;

    // If an image file was uploaded
    if (req.file) {
      imageUrl = `/uploads/problems/${req.file.filename}`;
    }

    const problem = new Problem({
      title,
      description,
      cropType,
      location: location || req.user.location || 'Unknown',
      image: imageUrl,
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
    const { title, description, cropType, location } = req.body;

    const problem = await Problem.findById(req.params.id);

    if (problem) {
      // Check if user owns the problem
      if (problem.createdBy.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this problem' });
      }

      problem.title = title || problem.title;
      problem.description = description || problem.description;
      problem.cropType = cropType || problem.cropType;
      problem.location = location || problem.location;

      // Handle image update
      if (req.file) {
        // Optional: Delete old image if it's a local file
        if (problem.image && problem.image.startsWith('/uploads/problems/')) {
          const oldImagePath = path.join(__dirname, '..', problem.image);
          if (fs.existsSync(oldImagePath)) {
             fs.unlinkSync(oldImagePath);
          }
        }
        problem.image = `/uploads/problems/${req.file.filename}`;
      } else if (req.body.image) {
          problem.image = req.body.image;
      }

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

      // Delete associated image file if it exists
      if (problem.image && problem.image.startsWith('/uploads/problems/')) {
        const imagePath = path.join(__dirname, '..', problem.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
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

// @desc    Like or Unlike a problem
// @route   PUT /api/problems/:id/like
// @access  Private
const toggleLikeProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const index = problem.likes.indexOf(req.user._id);

    if (index === -1) {
      // Like
      problem.likes.push(req.user._id);
    } else {
      // Unlike
      problem.likes.splice(index, 1);
    }

    await problem.save();
    res.json({ likes: problem.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bookmark or Unbookmark a problem
// @route   PUT /api/problems/:id/bookmark
// @access  Private
const toggleBookmarkProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const index = problem.bookmarks.indexOf(req.user._id);

    if (index === -1) {
      // Bookmark
      problem.bookmarks.push(req.user._id);
    } else {
      // Unbookmark
      problem.bookmarks.splice(index, 1);
    }

    await problem.save();
    res.json({ bookmarks: problem.bookmarks });
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
  toggleLikeProblem,
  toggleBookmarkProblem
};
