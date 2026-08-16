// server/routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const History = require('../models/History');

// GET /api/history/:userId — most recent 50 entries for this scholar
router.get('/:userId', async (req, res) => {
  try {
    const entries = await History.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Could not load history' });
  }
});

module.exports = router;