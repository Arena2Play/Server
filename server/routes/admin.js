const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');
const Investment = require('../models/Investment');
const Payment = require('../models/Payment');

// dashboard stats
router.get('/stats', protect, adminOnly, async (req, res)=>{
  const totalUsers = await User.countDocuments();
  const totalInvestments = await Investment.countDocuments();
  const sumInvested = await Investment.aggregate([
    { $match: { status: { $in:['pending','active','closed'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalAmount = (sumInvested[0] && sumInvested[0].total) || 0;
  const totalPayments = await Payment.countDocuments();
  res.json({ ok:true, totalUsers, totalInvestments, totalAmount, totalPayments });
});

// list investments (admin)
router.get('/investments', protect, adminOnly, async (req, res)=>{
  const invs = await Investment.find().populate('user','name email');
  res.json({ ok:true, invs });
});

module.exports = router;
