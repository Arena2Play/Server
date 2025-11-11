const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const { protect } = require('../middleware/auth');
const Payment = require('../models/Payment');
router.post('/stripe/create-payment-intent', protect, async (req, res)=>{
  try{
    const { amount, currency = 'usd' } = req.body;
    if(!amount) return res.status(400).json({ ok:false, error: 'amount required (in cents)' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: req.user._id.toString() }
    });
    const pay = new Payment({ user: req.user._id, amount: amount/100, method: 'stripe', status: 'pending', meta: { paymentIntentId: paymentIntent.id } });
    await pay.save();
    res.json({ ok:true, clientSecret: paymentIntent.client_secret, paymentId: pay._id });
  }catch(err){ console.error(err); res.status(500).json({ ok:false, error: err.message }); }
});
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res)=>{
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try{
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      event = req.body;
    }
  }catch(err){ console.error('Webhook error', err.message); return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_succeeded') {
    const pi = event.data.object;
    const payment = await Payment.findOne({ 'meta.paymentIntentId': pi.id });
    if (payment) {
      payment.status = 'succeeded';
      await payment.save();
      const User = require('../models/User');
      const user = await User.findById(payment.user);
      if (user) {
        user.balance = (user.balance || 0) + (payment.amount || 0);
        await user.save();
      }
    }
  }
  res.json({ received: true });
});
module.exports = router;
