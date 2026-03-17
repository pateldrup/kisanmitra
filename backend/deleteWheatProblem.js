const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const deleteProblem = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const result = await Problem.deleteOne({ title: "Wheat leaves turning yellow" });
    console.log(`Deleted ${result.deletedCount} problem(s)`);

    process.exit(0);
  } catch (err) {
    console.error('Error deleting problem:', err);
    process.exit(1);
  }
};

deleteProblem();
