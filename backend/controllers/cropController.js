const Crop = require('../models/Crop');
const FertilizerGuide = require('../models/FertilizerGuide');
const DiseaseGuide = require('../models/DiseaseGuide');

// Get all crops (with optional search and filter)
const getCrops = async (req, res) => {
  try {
    const { search, season, soilType, waterRequirement } = req.query;
    
    let query = {};

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filters
    if (season) query.season = season;
    if (soilType) query.soilType = { $regex: soilType, $options: 'i' };
    if (waterRequirement) query.waterRequirement = waterRequirement;

    const crops = await Crop.find(query);
    res.status(200).json(crops);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ message: 'Server error fetching crops' });
  }
};

// Get a single crop by ID, including fertilizer and disease guides
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Fetch related guides based on crop name
    const fertilizers = await FertilizerGuide.find({ cropName: crop.name });
    const diseases = await DiseaseGuide.find({ cropName: crop.name });

    res.status(200).json({
      crop,
      fertilizers,
      diseases
    });
  } catch (error) {
    console.error('Error fetching crop details:', error);
    res.status(500).json({ message: 'Server error fetching crop details' });
  }
};

// Compare two crops
const compareCrops = async (req, res) => {
    try {
        const { crop1Id, crop2Id } = req.query;
        
        if (!crop1Id || !crop2Id) {
             return res.status(400).json({ message: 'Provide both crop1Id and crop2Id' });
        }

        const crop1 = await Crop.findById(crop1Id);
        const crop2 = await Crop.findById(crop2Id);

        if (!crop1 || !crop2) {
            return res.status(404).json({ message: 'One or both crops not found for comparison' });
        }
        
        res.status(200).json({ crop1, crop2 });
    } catch (error) {
        console.error('Error comparing crops:', error);
        res.status(500).json({ message: 'Server error comparing crops' });
    }
};


module.exports = {
  getCrops,
  getCropById,
  compareCrops
};
