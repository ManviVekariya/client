// db/connection.js
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/youtube-video", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.log("MongoDB connection failed:", err);
});
