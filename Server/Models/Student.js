const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  id: String,
  skills: String,
  level: String,
  image: String,
});

module.exports = mongoose.model('Student', studentSchema);
