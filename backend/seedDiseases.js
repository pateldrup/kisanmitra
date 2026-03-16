require('dotenv').config();
const mongoose = require('mongoose');
const CropDisease = require('./models/CropDisease');
const connectDB = require('./config/db');

connectDB();

const diseases = [
    {
        cropName: 'Wheat',
        diseaseName: 'Wheat Rust',
        symptoms: ['Orange or reddish-brown pustules on leaves', 'Premature leaf drying', 'Shriveled grains'],
        treatment: 'Apply fungicides containing tebuconazole or propiconazole.',
        pesticide: 'Tebuconazole 250 EC',
        prevention: ['Use resistant varieties', 'Avoid excessive nitrogen fertilization', 'Timely sowing'],
        imageUrl: 'https://i.ibb.co/LhyTM8P/wheat-rust.jpg'
    },
    {
        cropName: 'Rice',
        diseaseName: 'Rice Blast',
        symptoms: ['Diamond-shaped lesions on leaves', 'Lesions with gray centers and brown borders', 'Neck rot in advanced stages'],
        treatment: 'Spray tricyclazole or carbendazim based fungicides.',
        pesticide: 'Tricyclazole 75% WP',
        prevention: ['Avoid excessive water stress', 'Burn infected crop residues', 'Balanced nitrogen application'],
        imageUrl: 'https://i.ibb.co/0VpL5hS/rice-blast.jpg'
    },
    {
        cropName: 'Maize',
        diseaseName: 'Maize Leaf Blight',
        symptoms: ['Long, elliptical, grayish-green or tan lesions', 'Lesions parallel to leaf margins', 'Extensive leaf drying'],
        treatment: 'Foliar spray with mancozeb or zineb.',
        pesticide: 'Mancozeb 75% WP',
        prevention: ['Crop rotation', 'Use clean-certified seeds', 'Deep plowing to bury residues'],
        imageUrl: 'https://i.ibb.co/m0fX6H8/maize-blight.jpg'
    },
    {
        cropName: 'Cotton',
        diseaseName: 'Bacterial Blight',
        symptoms: ['Angular water-soaked leaf spots', 'Black arm on stems', 'Boll rot'],
        treatment: 'Seed treatment and foliar spray with streptomycin.',
        pesticide: 'Streptocycline',
        prevention: ['Delinting of seeds', 'Field sanitation', 'Maintain proper spacing'],
        imageUrl: 'https://i.ibb.co/qD4k5rP/cotton-blight.jpg'
    }
];

const seedDiseases = async () => {
    try {
        await CropDisease.deleteMany();
        await CropDisease.insertMany(diseases);
        console.log('Crop Disease Knowledge Base Seeded!');
        process.exit();
    } catch (error) {
        console.error('Error seeding diseases:', error);
        process.exit(1);
    }
};

seedDiseases();
