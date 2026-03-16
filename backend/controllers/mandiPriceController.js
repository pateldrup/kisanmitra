const MandiPrice = require('../models/MandiPrice');

// @desc    Get all mandi prices (with optional filters)
// @route   GET /api/mandi-prices
// @access  Public
const getMandiPrices = async (req, res) => {
    try {
        const { crop, state, mandi } = req.query;
        let query = {};

        if (crop) {
            query.cropName = { $regex: new RegExp(`^${crop}$`, 'i') };
        }
        if (state) {
            query.state = { $regex: new RegExp(`^${state}$`, 'i') };
        }
        if (mandi) {
            query.mandiName = { $regex: new RegExp(`^${mandi}$`, 'i') };
        }

        const prices = await MandiPrice.find(query).sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: prices.length,
            data: prices
        });
    } catch (error) {
        console.error('Error fetching mandi prices:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Search mandi prices across multiple fields
// @route   GET /api/mandi-prices/search
// @access  Public
const searchMandiPrices = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: 'Please provide a search query (q parameter)' });
        }

        const searchRegex = new RegExp(q, 'i');
        const prices = await MandiPrice.find({
            $or: [
                { cropName: { $regex: searchRegex } },
                { mandiName: { $regex: searchRegex } },
                { state: { $regex: searchRegex } }
            ]
        }).sort({ date: -1 }).limit(50); // Limit results for performance

        res.status(200).json({
            success: true,
            count: prices.length,
            data: prices
        });
    } catch (error) {
        console.error('Error searching mandi prices:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get distinct filters (crops, states, mandis) for UI dropdowns
// @route   GET /api/mandi-prices/filters
// @access  Public
const getFilters = async (req, res) => {
    try {
        const crops = await MandiPrice.distinct('cropName');
        const states = await MandiPrice.distinct('state');
        const mandis = await MandiPrice.distinct('mandiName');
        
        res.status(200).json({
            success: true,
            data: {
                crops: crops.sort(),
                states: states.sort(),
                mandis: mandis.sort()
            }
        });
    } catch (error) {
        console.error('Error fetching filters:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getMandiPrices,
    searchMandiPrices,
    getFilters
};
