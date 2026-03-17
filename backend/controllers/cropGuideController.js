const CropGuideDetails = require('../models/CropGuideDetails');

// @desc    Get all crop guides
// @route   GET /api/crop-guide
// @access  Public
exports.getAllCropGuides = async (req, res) => {
  try {
    const guides = await CropGuideDetails.find({});
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching crop guides', error: error.message });
  }
};

// @desc    Get crop guide by name
// @route   GET /api/crop-guide/:cropName
// @access  Public
exports.getCropGuideByName = async (req, res) => {
  try {
    const cropName = req.params.cropName;
    // Perform case-insensitive search
    const cropGuide = await CropGuideDetails.findOne({ cropName: { $regex: new RegExp('^' + cropName + '$', 'i') } });

    if (!cropGuide) {
      return res.status(404).json({ message: 'Crop guide not found' });
    }

    res.status(200).json(cropGuide);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching crop guide', error: error.message });
  }
};
