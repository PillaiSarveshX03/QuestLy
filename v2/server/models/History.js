// server/models/History.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['quest', 'focus'], required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }, // only set for type: 'quest'
  xpEarned: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
