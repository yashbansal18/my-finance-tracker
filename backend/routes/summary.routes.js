const express = require('express');
const Expense = require('../models/expense.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

// GET monthly summary with category breakdown
router.get('/monthly', auth, async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    const [year, m] = (month || new Date().toISOString().slice(0, 7)).split('-').map(Number);

    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);

    const result = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalSpent = result.reduce((s, r) => s + r.total, 0);
    res.json({ month, totalSpent, breakdown: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET last 6 months totals for bar chart
router.get('/trend', auth, async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const m = d.getMonth(); // 0-indexed
      months.push({
        label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
        start: new Date(year, m, 1),
        end: new Date(year, m + 1, 1)
      });
    }

    const trend = await Promise.all(months.map(async (mn) => {
      const agg = await Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: mn.start, $lt: mn.end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      return { label: mn.label, total: agg[0]?.total || 0 };
    }));

    res.json(trend);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
