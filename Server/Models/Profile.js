const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: String,
  role: { type: String, default: 'Student' },
  gender: String,
  contact: String,
  city: String,
  email: String,
  linkedin: String,
  twitter: String
});

module.exports = mongoose.model('Profile', profileSchema);
