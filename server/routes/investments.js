const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Investment = require('../models/Investment');
router.post('/', protect, async (req, res)=>{
  try{
    const { amount, plan } = req.body;
    const inv = new Investment({ user: req.user._id, amount, plan, status: 'pending' });
    await inv.save();
    res.json({ ok:true, inv });
  }catch(err){ res.status(500).json({ ok:false, error: err.message }); }
});
router.get('/me', protect, async (req, res)=>{
  const invs = await Investment.find({ user: req.user._id });
  res.json({ ok:true, invs });
});
module.exports = router;
