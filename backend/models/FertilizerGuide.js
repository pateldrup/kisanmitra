const mongoose = require('mongoose');

const fertilizerGuideSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    ref: 'Crop' // Alternatively, we can use cropId (ObjectId) for better relations, using Name based on schema provided
  },
  fertilizerType: {
    type: String,
    required: true,
  },
  quantity: {
    type: String, // e.g., "50 kg/hectare"
    required: true,
  },
  usageTime: {
    type: String, // e.g., "During sowing", "After 30 days"
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('FertilizerGuide', fertilizerGuideSchema);
