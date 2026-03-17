const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CropGuideDetails = require('./models/CropGuideDetails');
const connectDB = require('./config/db');

dotenv.config();

const cropGuides = [
  {
    cropName: 'Wheat',
    overview: 'Wheat is a major rabi crop grown during the winter season and harvested in spring. It requires cool temperatures during growth and warm temperatures for grain filling.',
    season: 'Rabi',
    temperature: '10°C - 25°C',
    soilType: 'Loamy, well-drained fertile soil',
    waterRequirement: 'Medium',
    growthDuration: '120-150 days',
    tips: [
      'Use certified seeds',
      'Ensure proper irrigation during flowering',
      'Avoid water logging',
      'Use crop rotation'
    ],
    nutritionPlan: {
      fertilizers: [
        { name: 'Nitrogen (N)', amount: '120 kg/ha' },
        { name: 'Phosphorus (P)', amount: '60 kg/ha' },
        { name: 'Potassium (K)', amount: '40 kg/ha' }
      ],
      applicationStages: [
        'Basal application during sowing',
        'Top dressing during tillering stage',
        'Final dose before flowering'
      ],
      organicOptions: [
        'Compost',
        'Farmyard manure',
        'Biofertilizers'
      ]
    },
    diseases: [
      {
        diseaseName: 'Rust',
        symptoms: 'Yellow or brown pustules on leaves.',
        control: 'Use resistant varieties and apply fungicides.',
        pesticide: 'Propiconazole spray'
      },
      {
        diseaseName: 'Powdery Mildew',
        symptoms: 'White powdery patches on leaves and stems.',
        control: 'Maintain proper spacing, avoid excess nitrogen.',
        pesticide: 'Sulfur based fungicide'
      }
    ]
  },
  {
    cropName: 'Rice',
    overview: 'Rice is a primary kharif crop requiring high humidity, prolonged sunshine, and an assured supply of water.',
    season: 'Kharif',
    temperature: '22°C - 32°C',
    soilType: 'Heavy clay or clay loam',
    waterRequirement: 'High',
    growthDuration: '100-150 days',
    tips: [
      'Maintain 5cm standing water in the field',
      'Use high-yielding varieties',
      'Keep field weed-free during early growth',
      'Apply basal fertilizers properly'
    ],
    nutritionPlan: {
      fertilizers: [
        { name: 'Nitrogen (N)', amount: '100-150 kg/ha' },
        { name: 'Phosphorus (P)', amount: '50-60 kg/ha' },
        { name: 'Potassium (K)', amount: '40-50 kg/ha' }
      ],
      applicationStages: [
        'Basal dose before transplanting',
        'Top dressing at active tillering',
        'Top dressing at panicle initiation'
      ],
      organicOptions: [
        'Green manure (Dhaincha)',
        'Vermicompost',
        'Azolla'
      ]
    },
    diseases: [
      {
        diseaseName: 'Blast',
        symptoms: 'Spindle-shaped spots with grey center and brownish margin on leaves.',
        control: 'Avoid excessive nitrogen, use resistant varieties.',
        pesticide: 'Tricyclazole spray'
      },
      {
        diseaseName: 'Bacterial Leaf Blight',
        symptoms: 'Water-soaked lesions that turn yellow and later dry out.',
        control: 'Drain the field, avoid excess nitrogen application.',
        pesticide: 'Streptocycline spray'
      }
    ]
  },
  {
    cropName: 'Cotton',
    overview: 'Cotton is a major cash crop cultivated for its fibers. It thrives in sunny and dry climates and requires a frost-free period.',
    season: 'Kharif',
    temperature: '21°C - 30°C',
    soilType: 'Black cotton soil (Regur)',
    waterRequirement: 'Medium',
    growthDuration: '150-180 days',
    tips: [
      'Deep ploughing before sowing',
      'Timely weed management',
      'Avoid waterlogging during vegetative stage',
      'Pick cotton when bolls are fully open and dry'
    ],
    nutritionPlan: {
      fertilizers: [
        { name: 'Nitrogen (N)', amount: '120 kg/ha' },
        { name: 'Phosphorus (P)', amount: '60 kg/ha' },
        { name: 'Potassium (K)', amount: '60 kg/ha' }
      ],
      applicationStages: [
        'Basal application',
        'Top dressing at square formation',
        'Top dressing at peak flowering'
      ],
      organicOptions: [
        'Farmyard Manure (FYM)',
        'Neem cake'
      ]
    },
    diseases: [
      {
        diseaseName: 'Bollworm',
        symptoms: 'Damage to flower buds and bolls, causing them to fall.',
        control: 'Use pheromone traps, grow Bt cotton.',
        pesticide: 'Spinosad or Emamectin benzoate'
      },
      {
        diseaseName: 'Leaf Curl Virus',
        symptoms: 'Upward or downward curling of leaves, vein thickening.',
        control: 'Control whiteflies which act as vectors, use resistant varieties.',
        pesticide: 'Imidacloprid (for vector control)'
      }
    ]
  },
  {
    cropName: 'Maize',
    overview: 'Maize is a versatile crop grown primarily during the kharif season. It is responsive to good management and fertilization.',
    season: 'Kharif / Zaid',
    temperature: '21°C - 27°C',
    soilType: 'Well-drained loamy soil',
    waterRequirement: 'Medium',
    growthDuration: '90-110 days',
    tips: [
      'Maintain proper plant population',
      'Crucial irrigation at tasseling and silking stages',
      'Keep the field weed-free for the first 30 days',
      'Harvest at proper moisture content'
    ],
    nutritionPlan: {
      fertilizers: [
        { name: 'Nitrogen (N)', amount: '120-150 kg/ha' },
        { name: 'Phosphorus (P)', amount: '60 kg/ha' },
        { name: 'Potassium (K)', amount: '40 kg/ha' }
      ],
      applicationStages: [
        'Basal application with P & K',
        'Nitrogen split at knee-high stage',
        'Nitrogen split at tasseling'
      ],
      organicOptions: [
        'Vermicompost',
        'Green manuring before sowing'
      ]
    },
    diseases: [
      {
        diseaseName: 'Fall Armyworm',
        symptoms: 'Large ragged holes in leaves, feeding damage in the whorl.',
        control: 'Early planting, hand-picking egg masses, applying biological controls.',
        pesticide: 'Spinetoram or Chlorantraniliprole'
      },
      {
        diseaseName: 'Turcicum Leaf Blight',
        symptoms: 'Long, elliptical, grayish-green or brown lesions on leaves.',
        control: 'Use resistant hybrids, balanced fertilization.',
        pesticide: 'Mancozeb or Propiconazole'
      }
    ]
  },
  {
    cropName: 'Sugarcane',
    overview: 'Sugarcane is a long-duration cash crop requiring hot and humid climates. Proper water and nutrient management is key to high yields.',
    season: 'Annual',
    temperature: '20°C - 35°C',
    soilType: 'Deep, well-drained loamy to clay soils',
    waterRequirement: 'High',
    growthDuration: '10-18 months',
    tips: [
      'Select disease-free setts for planting',
      'Perform earthing up to prevent lodging',
      'Ensure regular intervals of irrigation',
      'Wrap and tie canes as they grow tall'
    ],
    nutritionPlan: {
      fertilizers: [
        { name: 'Nitrogen (N)', amount: '250-300 kg/ha' },
        { name: 'Phosphorus (P)', amount: '100 kg/ha' },
        { name: 'Potassium (K)', amount: '100 kg/ha' }
      ],
      applicationStages: [
        'Basal application',
        'First top dressing at 45 days',
        'Second top dressing at 90 days',
        'Final top dressing at 120 days'
      ],
      organicOptions: [
        'Press mud',
        'Farmyard manure'
      ]
    },
    diseases: [
      {
        diseaseName: 'Red Rot',
        symptoms: 'Loss of color in leaves, red tissues inside the cane when split, sour smell.',
        control: 'Use healthy setts, crop rotation, select resistant varieties.',
        pesticide: 'Carbendazim sett treatment before planting'
      },
      {
        diseaseName: 'Early Shoot Borer',
        symptoms: 'Dead heart in young shoots, easy to pull out.',
        control: 'Trash mulching, light earthing up at 30 days.',
        pesticide: 'Chlorantraniliprole'
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await CropGuideDetails.deleteMany();
    console.log('Cleared existing crop guides');
    await CropGuideDetails.insertMany(cropGuides);
    console.log('Inserted new crop guides successfully');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedDB();
