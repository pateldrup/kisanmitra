const mongoose = require('mongoose');

const diseaseGuideSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    ref: 'Crop' 
  },
  diseaseName: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  pesticide: {
    type: String, // Optional, since some solutions are organic/preventative
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('DiseaseGuide', diseaseGuideSchema);
