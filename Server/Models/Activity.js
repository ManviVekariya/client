const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  studentId: String,
  name: String,
  message: String,
  timestamp: Date
});

module.exports = mongoose.model("Activity", ActivitySchema);
