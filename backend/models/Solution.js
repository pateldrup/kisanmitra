const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  solutionText: {
    type: String,
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Problem',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Solution', solutionSchema);
