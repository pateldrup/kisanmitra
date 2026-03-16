const CropDisease = require('../models/CropDisease');
const Diagnosis = require('../models/Diagnosis');

// @desc    Diagnose crop disease from "uploaded" image (simulated)
// @route   POST /api/crop-doctor/diagnose
// @access  Private/Public (depending on auth)
const diagnoseCrop = async (req, res) => {
    try {
        const { cropName, imageUrl } = req.body; // In a real app, this would be an actual file upload

        // Simulated AI logic:
        // We fetch a random disease for the specified crop from our database
        // If cropName is not provided, we pick a random crop as well
        let query = {};
        if (cropName) {
            query.cropName = { $regex: new RegExp(cropName, 'i') };
        }

        const diseases = await CropDisease.find(query);
        
        if (diseases.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No diseases found for this crop in our database.'
            });
        }

        // Randomly pick one as the "detected" disease
        const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
        
        // Return result with a high confidence score for simulation
        const result = {
            cropName: detectedDisease.cropName,
            diseaseName: detectedDisease.diseaseName,
            confidence: Math.round(85 + Math.random() * 10),
            symptoms: detectedDisease.symptoms,
            treatment: detectedDisease.treatment,
            pesticide: detectedDisease.pesticide,
            prevention: detectedDisease.prevention,
            imageUrl: imageUrl || 'https://via.placeholder.com/300?text=Crop+Leaf'
        };

        // Save to history if user is logged in
        if (req.user) {
            await Diagnosis.create({
                user: req.user._id,
                ...result
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in diagnosis:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user diagnosis history
// @route   GET /api/crop-doctor/history
// @access  Private
const getDiagnosisHistory = async (req, res) => {
    try {
        const history = await Diagnosis.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all known diseases
// @route   GET /api/crop-doctor/diseases
// @access  Public
const getAllDiseases = async (req, res) => {
    try {
        const diseases = await CropDisease.find();
        res.status(200).json({
            success: true,
            data: diseases
        });
    } catch (error) {
        console.error('Error fetching diseases:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    diagnoseCrop,
    getDiagnosisHistory,
    getAllDiseases
};
