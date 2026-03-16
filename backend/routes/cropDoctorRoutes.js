const express = require('express');
const router = express.Router();
const { 
    diagnoseCrop, 
    getDiagnosisHistory, 
    getAllDiseases 
} = require('../controllers/cropDoctorController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/diseases', getAllDiseases);

// Protected routes (History needed)
router.post('/diagnose', protect, diagnoseCrop);
router.get('/history', protect, getDiagnosisHistory);

module.exports = router;
