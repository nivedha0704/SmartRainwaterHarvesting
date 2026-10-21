
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  authMiddleware,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const router = express.Router();

// All user management routes require Admin login
router.use(authMiddleware);
router.use(authorizeRoles('Admin'));

// Get all users without exposing passwords
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Load users error:', error.message);
    res.status(500).json({ message: 'Failed to load users.' });
  }
});

// Add a user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !role) {
      return res.status(400).json({
        message: 'Please complete all required fields.',
      });
    }

    if (password.length < 12) {
      return res.status(400).json({
        message: 'Password must contain at least 12 characters.',
      });
    }

    if (!['Inspector', 'Maintenance Staff'].includes(role)) {
      return res.status(400).json({ message: 'Invalid user role.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: 'User created successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Create user error:', error.message);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'Admin') {
      return res.status(403).json({
        message: 'Admin accounts cannot be deleted.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: `${user.name} was removed successfully.` });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Failed to remove user.' });
  }
});

module.exports = router;
