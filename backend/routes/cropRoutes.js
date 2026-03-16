const express = require('express');
const router = express.Router();
const { getCrops, getCropById, compareCrops } = require('../controllers/cropController');

// Route to get crops with search & filter (e.g. /api/crops?search=wheat&season=Rabi)
// This handles /api/crops, /api/crops/search, and /api/crops/filter by using query params
router.get('/', getCrops);

// Route to compare crops (needs to be before /:id so it doesn't try to parse 'compare' as an ID)
router.get('/compare', compareCrops);

// Route to get a specific crop by ID
router.get('/:id', getCropById);

module.exports = router;
