const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, pin } = req.body;
    if (!name || !email || !pin) return res.status(400).json({ message: 'All fields required' });
    if (pin.length < 4) return res.status(400).json({ message: 'PIN must be at least 4 digits' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, pin });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, salary: user.salary } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, pin } = req.body;
    if (!email || !pin) return res.status(400).json({ message: 'Email and PIN required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePin(pin))) {
      return res.status(401).json({ message: 'Invalid email or PIN' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, salary: user.salary } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update salary
router.put('/salary', authMiddleware, async (req, res) => {
  try {
    const { salary } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { salary }, { new: true }).select('-pin');
    res.json({ salary: user.salary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update PIN
router.put('/pin', authMiddleware, async (req, res) => {
  try {
    const { currentPin, newPin } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePin(currentPin))) return res.status(401).json({ message: 'Current PIN is incorrect' });
    user.pin = newPin;
    await user.save();
    res.json({ message: 'PIN updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
