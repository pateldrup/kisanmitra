const mongoose = require('mongoose');

const cropGuideDetailsSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    unique: true,
  },
  overview: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  waterRequirement: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  growthDuration: {
    type: String,
    required: true,
  },
  tips: {
    type: [String],
    default: [],
  },
  nutritionPlan: {
    fertilizers: [
      {
        name: String,
        amount: String,
      }
    ],
    applicationStages: [String],
    organicOptions: [String]
  },
  diseases: [
    {
      diseaseName: String,
      symptoms: String,
      control: String,
      pesticide: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('CropGuideDetails', cropGuideDetailsSchema);
