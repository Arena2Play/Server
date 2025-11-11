require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const investRoutes = require('./routes/investments');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_FALLBACK_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Exiting.');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> { console.error('MongoDB connection error', err); process.exit(1); });

app.use('/api/auth', authRoutes);
app.use('/api/investments', investRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res)=> res.json({ ok:true, message: 'Investment API running' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
