const express = require('express');
const router = express.Router();
const { 
    getMandiPrices, 
    searchMandiPrices,
    getFilters 
} = require('../controllers/mandiPriceController');

// Search route must come before /:id routes if any exist, right now none though
router.get('/search', searchMandiPrices);

// Filters route helper
router.get('/filters', getFilters);

// Base route for GET filters logic
router.get('/', getMandiPrices);

module.exports = router;
