require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Investment = require('./models/Investment');
const MONGO = process.env.MONGO_URI;
mongoose.connect(MONGO, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> seed())
  .catch(err=> console.error(err));
async function seed(){
  try{
    await User.deleteMany({});
    await Investment.deleteMany({});
    const admin = new User({ name: 'Admin', email: 'admin@example.com', password: 'AdminPass123!', role: 'admin', balance: 0 });
    await admin.save();
    const user1 = new User({ name: 'Test User', email: 'user@example.com', password: 'UserPass123!', role: 'user', balance: 50 });
    await user1.save();
    const inv = new Investment({ user: user1._id, amount: 25, plan: 'Basic', status: 'active' });
    await inv.save();
    console.log('Seed completed. Admin credentials: admin@example.com / AdminPass123!');
    process.exit(0);
  }catch(err){ console.error(err); process.exit(1); }
}
