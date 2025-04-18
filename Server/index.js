require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('./Models/User'); 
const Course = require('./Models/Course');
const studentRoutes = require('./routes/studentRoutes');
const Activity = require("./Models/Activity");
const Announcement = require('./Models/Announcement');
const profileRoutes = require('./routes/profileRoutes');
// Make sure this file exists

const app = express();
app.use(cors());
app.use(express.json());

// 🌐 Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/student-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 📧 Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendVerificationEmail = async (email, name, token) => {
  const link = `http://localhost:3000/verify-email/${token}`;
  const mailOptions = {
    from: `"E-Learning Portal" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Hello ${name},</h3>
      <p>Click below to verify your email:</p>
      <a href="${link}" style="
        background-color:#4CAF50;
        padding:10px 20px;
        color:white;
        text-decoration:none;
        border-radius:5px;
      ">Verify Email</a>
    `
  };

  await transporter.sendMail(mailOptions);
};

// 👤 Register Route
app.post('/register', async (req, res) => {
  const { name, email, phone, city, password } = req.body;
  if (!name || !email || !phone || !city || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      name,
      email,
      phone,
      city,
      password: hashedPassword,
      verificationToken: token
    });

    await newUser.save();
    await sendVerificationEmail(email, name, token);

    res.status(200).json({ message: "User registered. Verify your email." });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// 📩 Email Verification Route
app.get('/verify-email/:token', async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token });
  if (!user) return res.status(400).send("Invalid token");

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.send('Email verified! You can now <a href="http://localhost:3000/login">Login</a>');
});

// 🔐 Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });
  if (!user.isVerified) return res.status(403).json({ message: "Please verify your email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Incorrect password" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    city: user.city,
    phone: user.phone
  });
});

// 🧠 Dashboard Route
app.get('/dashboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -verificationToken');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
});

// 📘 Assignment Schema
const assignmentSchema = new mongoose.Schema({
  question: String,
  status: String,
  score: Number // use null for not attempted
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

// 📥 Get All Assignments
app.get("/api/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assignments", error: err.message });
  }
});

// ➕ Add New Assignment
app.post('/api/assignments', async (req, res) => {
  const { question, status, score } = req.body;
  if (!question || !status || score === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAssignment = new Assignment({
      question,
      status,
      score: score || null
    });

    await newAssignment.save();
    res.status(200).json(newAssignment);
  } catch (err) {
    res.status(500).json({ message: "Error publishing assignment", error: err.message });
  }
});
// Assuming you have a 'User' model with an 'enrolledCourses' array
// Example of populating activeCourses when fetching a user
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.use('/api/students', studentRoutes);

app.get("/api/activities", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});
// 📰 Create an announcement
app.post('/api/announcements', async (req, res) => {
  const { title, body, to } = req.body;

  if (!title || !body || !to) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAnnouncement = new Announcement({ title, body, to });
    await newAnnouncement.save();
    res.status(200).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ message: "Error adding announcement", error: err.message });
  }
});

// 📢 Get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcements", error: err.message });
  }
});

app.use('/api/profile', profileRoutes);


// 🚀 Start Server
app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
