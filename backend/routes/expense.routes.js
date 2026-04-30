const express = require('express');
const Expense = require('../models/expense.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// GET all expenses (with optional month filter)
router.get('/', auth, async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM
    let filter = { user: req.user._id };
    if (month) {
      const [year, m] = month.split('-').map(Number);
      filter.date = {
        $gte: new Date(year, m - 1, 1),
        $lt: new Date(year, m, 1)
      };
    }
    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create expense
router.post('/', auth, async (req, res) => {
  try {
    const { date, category, note, amount } = req.body;
    if (!date || !category || !amount) return res.status(400).json({ message: 'date, category and amount are required' });
    const expense = await Expense.create({ user: req.user._id, date, category, note, amount });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
