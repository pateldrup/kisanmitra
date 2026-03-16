require('dotenv').config();
const mongoose = require('mongoose');
const MandiPrice = require('./models/MandiPrice');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Mock Data structure
const states = ['Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Gujarat'];
const crops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Soybean'];
const mandisByState = {
    'Maharashtra': ['APMC Vashi', 'Pune Mandi', 'Nagpur APMC'],
    'Punjab': ['Ludhiana Mandi', 'Amritsar APMC', 'Jalandhar Market'],
    'Haryana': ['Karnal Mandi', 'Panipat Market', 'Rohtak APMC'],
    'Uttar Pradesh': ['Kanpur Mandi', 'Agra APMC', 'Varanasi Market'],
    'Gujarat': ['Ahmedabad APMC', 'Rajkot Mandi', 'Surat Market']
};

const basePrices = {
    'Wheat': 2500,
    'Rice': 3200,
    'Maize': 2100,
    'Cotton': 6800,
    'Sugarcane': 350,
    'Soybean': 4500
};

const generateData = () => {
    let priceData = [];
    const today = new Date();
    
    // Generate data for the last 14 days
    for (let i = 0; i < 14; i++) {
        const generationDate = new Date(today);
        generationDate.setDate(generationDate.getDate() - i);
        
        // Ensure some random variations in the prices over time
        for (const state of states) {
            for (const mandi of mandisByState[state]) {
                // Not every crop is present in every mandi on every day, so random pick 3-4
                const shuffledCrops = crops.sort(() => 0.5 - Math.random());
                const selectedCrops = shuffledCrops.slice(0, 4);

                for (const crop of selectedCrops) {
                    const base = basePrices[crop];
                    // Add random fluctuation between -5% to +5%
                    const variation = base * (Math.random() * 0.1 - 0.05);
                    const modalPrice = Math.round(base + variation);
                    const minPrice = Math.round(modalPrice * 0.95);
                    const maxPrice = Math.round(modalPrice * 1.05);

                    priceData.push({
                        cropName: crop,
                        mandiName: mandi,
                        state: state,
                        minPrice,
                        maxPrice,
                        modalPrice,
                        date: new Date(generationDate)
                    });
                }
            }
        }
    }
    
    return priceData;
};

const importData = async () => {
    try {
        await MandiPrice.deleteMany(); // Clear old data

        const sampleData = generateData();
        
        await MandiPrice.insertMany(sampleData);

        console.log('Mandi price data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
