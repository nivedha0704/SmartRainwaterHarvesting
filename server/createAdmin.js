
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

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const name = await ask('Admin name: ');
    const email = (await ask('Admin email: ')).trim().toLowerCase();
    const password = await ask('Admin password (12+ characters): ');

    if (!name.trim() || !email || password.length < 12) {
      throw new Error('Enter a name, email, and password of at least 12 characters.');
    }

    const existingAdmin = await User.findOne({ role: 'Admin' });

    if (existingAdmin) {
      throw new Error('An Admin already exists. No account created.');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('This email is already registered.');
    }

    await User.create({
      name: name.trim(),
      email,
      password: await hashPassword(password),
      role: 'Admin',
    });

    console.log('Admin account created successfully!');
  } catch (error) {
    console.error('Admin setup failed:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

createAdmin();
