// models/DSAProblem.js
const mongoose = require('mongoose');

const DSAProblemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemName: { type: String, required: true },
  platform: { type: String, required: true },
  link: { type: String },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Unknown'],
    default: 'Unknown'
  },
  topic: { type: String, default: 'General' }
}, { timestamps: true }); // `timestamps: true` automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('DSAProblem', DSAProblemSchema);
