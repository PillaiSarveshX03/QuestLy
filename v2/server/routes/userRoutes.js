// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users — list every profile, newest first (for the profile picker)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Could not load profiles' });
  }
});

// POST /api/users — create a new profile { username }
router.post('/', async (req, res) => {
  try {
    const username = (req.body.username || '').trim();
    if (!username) return res.status(400).json({ error: 'A name is required' });

    const user = await User.create({ username });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'That name is already taken' });
    }
    res.status(500).json({ error: 'Could not create profile' });
  }
});

// GET /api/users/:id — fetch a single profile (used after switching profiles)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Profile not found' });
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'Profile not found' });
  }
});

module.exports = router;