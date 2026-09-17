// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, default: 'Scholar', unique: true, trim: true, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);