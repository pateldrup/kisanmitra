const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Crop = require('./models/Crop');
const FertilizerGuide = require('./models/FertilizerGuide');
const DiseaseGuide = require('./models/DiseaseGuide');

// Load env vars
dotenv.config();

const crops = [
  {
    name: 'Wheat',
    image: '/images/crops/wheat.jpg',
    season: 'Rabi',
    soilType: 'Loamy',
    waterRequirement: 'Medium',
    temperatureRange: '10°C - 25°C',
    growthDuration: '120-150 days',
    description: 'Wheat is a grass widely cultivated for its seed, a cereal grain which is a worldwide staple food. It thrives in cool climates and requires well-drained loamy soil.',
    expectedYield: '3000-4000 kg/ha',
    farmingTips: {
      bestPractices: [
        'Ensure proper land leveling before sowing.',
        'Use high-yield, disease-resistant seed varieties.',
        'Apply initial irrigation 21 days after sowing (Crown Root Initiation stage).'
      ],
      commonMistakes: [
        'Over-irrigating during the early vegetative stage.',
        'Delaying sowing past November, which reduces yield.',
        'Ignoring early signs of yellow rust.'
      ],
      yieldTips: [
        'Apply split doses of Nitrogen for better uptake.',
        'Ensure timely weed control within first 30-40 days.'
      ]
    }
  },
  {
    name: 'Rice (Paddy)',
    image: '/images/crops/rice.jpg',
    season: 'Kharif',
    soilType: 'Clay',
    waterRequirement: 'High',
    temperatureRange: '21°C - 37°C',
    growthDuration: '100-150 days',
    description: 'Rice is the seed of the grass species Oryza sativa. As a cereal grain, it is the most widely consumed staple food for a large part of the world\'s human population. It requires standing water for optimal growth.',
    expectedYield: '4000-6000 kg/ha',
    farmingTips: {
      bestPractices: [
        'Maintain 2-5 cm of standing water during the vegetative phase.',
        'Practice System of Rice Intensification (SRI) for higher water efficiency.',
        'Transplant seedlings at optimal age (20-25 days).'
      ],
      commonMistakes: [
        'Using excess Nitrogen, leading to pest susceptibility.',
        'Allowing the field to dry completely during panicle initiation.',
        'Planting too densely.'
      ],
      yieldTips: [
        'Apply zinc sulfate if soils are deficient.',
        'Use blue-green algae or Azolla for bio-fertilization.'
      ]
    }
  },
  {
    name: 'Maize',
    image: '/images/crops/maize.jpg',
    season: 'Kharif',
    soilType: 'Loamy',
    waterRequirement: 'Medium',
    temperatureRange: '21°C - 27°C',
    growthDuration: '90-110 days',
    description: 'Maize, also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico. It is a versatile crop grown across various climates.',
    expectedYield: '2500-3500 kg/ha',
    farmingTips: {
      bestPractices: [
        'Plant in ridges to avoid waterlogging.',
        'Ensure adequate moisture during the silking stage.',
        'Maintain optimal plant population (60,000-75,000 plants/ha).'
      ],
      commonMistakes: [
        'Planting in poorly drained soils.',
        'Inadequate weed control during the first 30 days.',
        'Late harvesting leading to moisture damage.'
      ],
      yieldTips: [
        'Apply Phosphorus and Potassium entirely as basal dose.',
        'Apply Nitrogen in 3 splits for maximum efficiency.'
      ]
    }
  }
];

const fertilizers = [
  {
    cropName: 'Wheat',
    fertilizerType: 'Urea (Nitrogen)',
    quantity: '120 kg/ha',
    usageTime: 'Split: 1/2 at sowing, 1/2 at 1st irrigation'
  },
  {
    cropName: 'Wheat',
    fertilizerType: 'DAP (Phosphorus)',
    quantity: '60 kg/ha',
    usageTime: 'Basal dose at time of sowing'
  },
  {
    cropName: 'Rice (Paddy)',
    fertilizerType: 'Urea',
    quantity: '100 kg/ha',
    usageTime: '3 Splits: Basal, Tillering, Panicle Initiation'
  },
  {
    cropName: 'Rice (Paddy)',
    fertilizerType: 'MOP (Potassium)',
    quantity: '40 kg/ha',
    usageTime: 'Basal dose'
  }
];

const diseases = [
  {
    cropName: 'Wheat',
    diseaseName: 'Yellow Rust',
    symptoms: 'Yellow stripes of blister-like lesions on leaves.',
    solution: 'Use resistant varieties and apply timely fungicides.',
    pesticide: 'Propiconazole 25 EC (0.1%)'
  },
  {
    cropName: 'Wheat',
    diseaseName: 'Loose Smut',
    symptoms: 'Wheat heads are replaced by a mass of black fungal spores.',
    solution: 'Treat seeds before sowing.',
    pesticide: 'Carboxin or Tebuconazole seed treatment'
  },
  {
    cropName: 'Rice (Paddy)',
    diseaseName: 'Bacterial Leaf Blight',
    symptoms: 'Water-soaked translucent lesions on leaf margins turning yellow-white.',
    solution: 'Avoid excess nitrogen, ensure good drainage. No highly effective chemical cure.',
    pesticide: 'Copper fungicides can provide limited suppression'
  },
  {
    cropName: 'Rice (Paddy)',
    diseaseName: 'Blast',
    symptoms: 'Diamond-shaped spots with gray centers and brown borders on leaves.',
    solution: 'Avoid water stress, use resistant varieties.',
    pesticide: 'Tricyclazole 75 WP'
  }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // clear existing data
    await Crop.deleteMany();
    await FertilizerGuide.deleteMany();
    await DiseaseGuide.deleteMany();
    console.log('Existing data cleared');

    // insert new data
    await Crop.insertMany(crops);
    await FertilizerGuide.insertMany(fertilizers);
    await DiseaseGuide.insertMany(diseases);
    console.log('Sample Data Imported!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
