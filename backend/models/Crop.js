const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid'],
    required: true,
  },
  soilType: {
    type: String, // Can also be an array if multiple soil types apply, but keeping string for simplicity
    enum: ['Clay', 'Loamy', 'Sandy', 'Alluvial', 'Black', 'Red'], // Added a few common ones
    required: true,
  },
  waterRequirement: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  temperatureRange: {
    type: String, // e.g., "20°C - 30°C"
    required: true,
  },
  growthDuration: {
    type: String, // e.g., "90-120 days"
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expectedYield: {
      type: String,
      required: false, // Optional for now
  },
  farmingTips: {
      bestPractices: [String],
      commonMistakes: [String],
      yieldTips: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
