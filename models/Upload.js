const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled' },
  description: { type: String, default: '' },
  filename: String,
  uploader: {
    discordId: String,
    username: String,
    displayName: String
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', uploadSchema);