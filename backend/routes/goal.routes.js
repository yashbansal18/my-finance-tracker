const express = require('express');
const Goal = require('../models/goal.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, emoji } = req.body;
    if (!name || !targetAmount) return res.status(400).json({ message: 'name and targetAmount required' });
    const goal = await Goal.create({ user: req.user._id, name, targetAmount, savedAmount, emoji });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
