// @desc    Generate a stable but 'randomized' hash-based number seed from a string (location)
const seededRandom = (str, offset = 0) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    const seed = Math.abs(hash + offset);
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Weather conditions we can pick from
const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Clear'];

// @desc    Get current weather for a location
// @route   GET /api/weather/current
// @access  Public
const getCurrentWeather = (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
             return res.status(400).json({ success: false, message: 'Please provide a location' });
        }

        const dateOffset = new Date().getDate(); // Changes daily
        const rand = seededRandom(location.toLowerCase(), dateOffset);
        
        // Base numbers
        const temperature = Math.floor(20 + (rand * 20)); // 20 to 40 C
        const humidity = Math.floor(40 + (rand * 50)); // 40% to 90%
        const windSpeed = Math.floor(5 + (rand * 20)); // 5 to 25 km/h
        const rainChance = Math.floor(rand * 100); // 0% to 99%
        
        let conditionIndex = Math.floor(rand * conditions.length);
        
        // Adjust condition realistically based on rain chance
        if (rainChance > 80) conditionIndex = 4; // Heavy Rain
        else if (rainChance > 50) conditionIndex = 3; // Light Rain
        else if (rainChance < 10 && temperature > 32) conditionIndex = 0; // Sunny
        
        res.status(200).json({
            success: true,
            data: {
                location,
                temperature,
                humidity,
                windSpeed,
                rainChance,
                condition: conditions[conditionIndex],
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error('Error fetching current weather:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get 7-day forecast for a location
// @route   GET /api/weather/forecast
// @access  Public
const getForecast = (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
             return res.status(400).json({ success: false, message: 'Please provide a location' });
        }

        const baseDate = new Date();
        const forecast = [];

        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(baseDate);
            nextDate.setDate(baseDate.getDate() + i);
            
            // Stable seed for each day for a specific location
            const rand = seededRandom(location.toLowerCase(), nextDate.getDate());
            
            const temperature = Math.floor(20 + (rand * 20));
            const rainChance = Math.floor(rand * 100);
            
            let conditionIndex = Math.floor(rand * conditions.length);
            if (rainChance > 80) conditionIndex = 4;
            else if (rainChance > 50) conditionIndex = 3;
            else if (rainChance < 10 && temperature > 32) conditionIndex = 0;

            forecast.push({
                date: nextDate.toISOString().split('T')[0],
                day: nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
                temperature,
                rainChance,
                condition: conditions[conditionIndex]
            });
        }

        res.status(200).json({
            success: true,
            data: forecast
        });

    } catch (error) {
        console.error('Error fetching forecast:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get 24-hour hourly forecast
// @route   GET /api/weather/hourly
// @access  Public
const getHourly = (req, res) => {
    try {
        const { location } = req.query;
        if (!location) {
             return res.status(400).json({ success: false, message: 'Please provide a location' });
        }

        const baseHour = new Date().getHours();
        const baseRand = seededRandom(location.toLowerCase(), new Date().getDate());
        const baseTemp = Math.floor(20 + (baseRand * 20));
        
        const hourly = [];

        for (let i = 0; i < 24; i++) {
            let hourStr = (baseHour + i) % 24;
            const period = hourStr >= 12 ? 'PM' : 'AM';
            hourStr = hourStr % 12 || 12; // Convert 0 to 12
            const timeLabel = `${hourStr} ${period}`;
            
            // Introduce a diurnal temperature cycle (cooler at night, warmer in afternoon)
            const realHour = (baseHour + i) % 24;
            const isDaytime = realHour >= 6 && realHour <= 18;
            const tempOffset = isDaytime ? Math.sin((realHour - 6) / 12 * Math.PI) * 8 : -3;
            
            const rand = seededRandom(location.toLowerCase() + i, new Date().getDate());
            const rainChance = Math.floor(rand * 100);

            hourly.push({
                time: timeLabel,
                temperature: Math.round(baseTemp + tempOffset),
                rainChance
            });
        }

        res.status(200).json({
            success: true,
            data: hourly
        });

    } catch (error) {
        console.error('Error fetching hourly weather:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getCurrentWeather,
    getForecast,
    getHourly
};
