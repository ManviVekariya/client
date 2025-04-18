const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  city: String,
  password: String,
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  hoursLearned: {
    type: Number,
    default: 0
  },
  assignmentsDue: {
    type: Number,
    default: 0
  },
  certificates: {
    type: Number,
    default: 0
  },
  activeCourses: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);
