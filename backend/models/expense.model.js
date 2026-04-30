const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  category: {
    type: String, required: true,
    enum: [
      'Rent', 'Groceries', 'Petrol', 'Zomato / Swiggy', 'Eating out',
      'Subscriptions', 'Smoke', 'Bills & utilities', 'EMI',
      'Shopping', 'Medical', 'Entertainment', 'Transport',
      'Investment / SIP', 'Other'
    ]
  },
  note: { type: String, trim: true, default: '' },
  amount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Index for fast monthly queries
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
