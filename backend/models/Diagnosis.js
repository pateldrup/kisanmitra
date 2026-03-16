const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cropName: {
        type: String,
        required: true
    },
    diseaseName: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    symptoms: [String],
    treatment: String,
    pesticide: String,
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);

module.exports = Diagnosis;
