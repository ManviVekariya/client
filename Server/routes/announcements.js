const express = require('express');
const router = express.Router();
const Announcement = require('../Models/Announcement'); // Assuming you have an Announcement model

// Fetch all announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcements", error: err.message });
  }
});

// Post an announcement
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const newAnnouncement = new Announcement({ title, content });
    await newAnnouncement.save();
    res.status(200).json(newAnnouncement);
  } catch (err) {
    res.status(500).json({ message: "Error saving announcement", error: err.message });
  }
});

module.exports = router; // Don't forget to export the router
