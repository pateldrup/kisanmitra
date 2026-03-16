const mongoose = require('mongoose');

const cropDiseaseSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true,
        trim: true
    },
    diseaseName: {
        type: String,
        required: true,
        trim: true
    },
    symptoms: [{
        type: String
    }],
    treatment: {
        type: String,
        required: true
    },
    pesticide: {
        type: String
    },
    prevention: [{
        type: String
    }],
    imageUrl: {
        type: String
    }
}, {
    timestamps: true
});

const CropDisease = mongoose.model('CropDisease', cropDiseaseSchema);

module.exports = CropDisease;
