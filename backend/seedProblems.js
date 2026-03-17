require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Problem = require('./models/Problem');
const connectDB = require('./config/db');

connectDB();

const seedProblems = async () => {
  try {
    // Remove existing problems
    await Problem.deleteMany();

    // Find or create a demo user
    let demoUser = await User.findOne({ email: 'demo@kisanmitra.com' });
    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('demo1234', salt);
      demoUser = await User.create({
        name: 'Ramesh Kumar',
        email: 'demo@kisanmitra.com',
        password: hashedPassword,
        location: 'Punjab'
      });
      console.log('Demo user created!');
    }

    const problems = [
      {
        title: 'Wheat leaves turning yellow',
        description: 'My wheat crop leaves are turning yellow from the tips. This started about a week ago and is spreading fast. What could be the reason and how to fix it?',
        cropType: 'Wheat',
        image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop', // Realistic wheat
        location: 'Ludhiana, Punjab',
        createdBy: demoUser._id,
      },
      {
        title: 'Rice plants not growing after transplanting',
        description: 'I transplanted rice seedlings 10 days ago but they are not showing any new growth. The soil looks fine but the plants seem stunted. Please help.',
        cropType: 'Rice',
        image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=600&auto=format&fit=crop', // Rice field
        location: 'Amritsar, Punjab',
        createdBy: demoUser._id,
      },
      {
        title: 'White flies attacking my cotton crop',
        description: 'There is a large infestation of white flies on my cotton plants. The leaves are becoming sticky and curling. What pesticide should I use?',
        cropType: 'Cotton',
        image: 'https://images.unsplash.com/photo-1601614050275-f935398ab0f1?q=80&w=600&auto=format&fit=crop', // Cotton plant
        location: 'Bathinda, Punjab',
        createdBy: demoUser._id,
      },
      {
        title: 'Maize cobs are forming but too small',
        description: 'My maize plants are healthy but the cobs forming are very small in size compared to expected. I applied fertilizer at sowing time. What am I missing?',
        cropType: 'Maize',
        image: 'https://images.unsplash.com/photo-1510629579083-d02cc2492fdb?q=80&w=600&auto=format&fit=crop', // Corn
        location: 'Jalandhar, Punjab',
        createdBy: demoUser._id,
      },
      {
        title: 'Sugarcane red rot disease spotted',
        description: 'I found red discoloration inside the stalks of some of my sugarcane plants. The plants are wilting and dying from the top. Is this red rot? What can I do?',
        cropType: 'Sugarcane',
        image: 'https://images.unsplash.com/photo-1596767228383-0504d60fc900?q=80&w=600&auto=format&fit=crop', // Sugarcane
        location: 'Hoshiarpur, Punjab',
        createdBy: demoUser._id,
      }
    ];

    await Problem.insertMany(problems);
    console.log('Community Problems Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding problems:', error);
    process.exit(1);
  }
};

seedProblems();
