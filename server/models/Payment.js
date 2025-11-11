const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  method: { type: String, default: 'stripe' }, // could be 'bank', 'crypto', etc.
  status: { type: String, enum: ['pending','succeeded','failed'], default: 'pending' },
  meta: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
