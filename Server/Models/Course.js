const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String // Assuming image is a string (URL or file path)
});

module.exports = mongoose.model("Course", courseSchema);
