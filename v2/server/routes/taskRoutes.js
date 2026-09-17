// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const History = require('../models/History');
const awardXp = require('../utils/awardXp');

const XP_MAP = { Easy: 50, Medium: 100, Hard: 200 };

// GET /api/tasks/:userId — incomplete quests for this scholar, newest first
router.get('/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.userId, isCompleted: false }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Could not load quests' });
  }
});

// POST /api/tasks — { title, difficulty, userId }
router.post('/', async (req, res) => {
  try {
    const { title, difficulty, userId } = req.body;
    if (!title || !userId) return res.status(400).json({ error: 'title and userId are required' });

    const task = await Task.create({
      title,
      difficulty,
      xpReward: XP_MAP[difficulty] || XP_MAP.Medium,
      user: userId
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Could not create quest' });
  }
});

// POST /api/tasks/:id/complete — { userId }
router.post('/:id/complete', async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Quest not found' });

    task.isCompleted = true;
    await task.save();

    const { user, leveledUp } = await awardXp(userId, task.xpReward);

    await History.create({
      user: userId,
      type: 'quest',
      title: task.title,
      difficulty: task.difficulty,
      xpEarned: task.xpReward
    });

    res.json({ user, leveledUp });
  } catch (err) {
    res.status(500).json({ error: 'Could not complete quest' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete quest' });
  }
});

// POST /api/tasks/bonus-xp — { userId, minutes }  (used by the focus timer)
// 3 XP per minute — a 25-minute session still nets the original +75 XP.
router.post('/bonus-xp', async (req, res) => {
  try {
    const { userId, minutes } = req.body;
    if (!userId || !minutes) return res.status(400).json({ error: 'userId and minutes are required' });

    const xpEarned = Math.max(1, Math.round(minutes * 3));
    const { user, leveledUp } = await awardXp(userId, xpEarned);

    await History.create({
      user: userId,
      type: 'focus',
      title: `${minutes}-minute focus session`,
      xpEarned
    });

    res.json({ user, leveledUp, xpEarned });
  } catch (err) {
    res.status(500).json({ error: 'Could not award focus XP' });
  }
});

module.exports = router;