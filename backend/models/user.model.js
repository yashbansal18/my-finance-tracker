const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  pin: { type: String, required: true }, // hashed 4-8 digit PIN
  salary: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Hash PIN before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('pin')) return next();
  this.pin = await bcrypt.hash(this.pin, 12);
  next();
});

userSchema.methods.comparePin = async function (candidatePin) {
  return bcrypt.compare(candidatePin, this.pin);
};

module.exports = mongoose.model('User', userSchema);
