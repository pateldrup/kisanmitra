const express = require('express');
const router = express.Router();
const { 
    getCurrentWeather, 
    getForecast, 
    getHourly 
} = require('../controllers/weatherController');

router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/hourly', getHourly);

module.exports = router;
