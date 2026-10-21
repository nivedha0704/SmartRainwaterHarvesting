
require('dotenv').config();

const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./models/User');
const { hashPassword } = require('./utils/auth');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = (await ask('Admin email: '))
      .trim()
      .toLowerCase();

    const user = await User.findOne({ email, role: 'Admin' });

    if (!user) {
      throw new Error('Admin account not found.');
    }

    const password = await ask('Enter new password (12+ characters): ');

    if (password.length < 12) {
      throw new Error('Password must contain at least 12 characters.');
    }

    user.password = await hashPassword(password);
    await user.save();

    console.log('Admin password updated successfully!');
  } catch (error) {
    console.error('Password reset failed:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

resetPassword();
