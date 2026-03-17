const express = require('express');
const router = express.Router();
const { getAllCropGuides, getCropGuideByName } = require('../controllers/cropGuideController');

// Routes
router.get('/', getAllCropGuides);
router.get('/:cropName', getCropGuideByName);

module.exports = router;
