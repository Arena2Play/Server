const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
router.post('/register', async (req, res)=>{
  try{
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ ok:false, error: 'Email already registered' });
    const user = new User({ name, email, password });
    await user.save();
    res.json({ ok:true, message: 'Registered' });
  }catch(err){ res.status(500).json({ ok:false, error: err.message }); }
});
router.post('/login', async (req, res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ ok:false, error: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if(!match) return res.status(400).json({ ok:false, error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ ok:true, token });
  }catch(err){ res.status(500).json({ ok:false, error: err.message }); }
});
module.exports = router;
