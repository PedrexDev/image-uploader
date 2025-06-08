const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: String,
  displayName: String,
  avatar: String,
  email: String,
  role: { type: String, enum: ['owner', 'user'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);