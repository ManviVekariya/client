const express = require('express');
const router = express.Router();
const Profile = require('../Models/Profile');

// GET profile (assuming one profile per user for now)
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne(); // you can filter by user ID if needed
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

// POST (update or create) profile
router.post('/', async (req, res) => {
  try {
    const existing = await Profile.findOne(); // if using user ID, change this line
    if (existing) {
      // update
      Object.assign(existing, req.body);
      await existing.save();
      res.json({ message: 'Profile updated', profile: existing });
    } else {
      // create
      const newProfile = new Profile(req.body);
      await newProfile.save();
      res.json({ message: 'Profile created', profile: newProfile });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to save profile', error: err.message });
  }
});

module.exports = router;
