
const express = require('express');
const mongoose = require('mongoose');
const Maintenance = require('../models/Maintenance');
const {
  authMiddleware,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get all maintenance tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Maintenance.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Load maintenance error:', error.message);
    res.status(500).json({ message: 'Failed to load maintenance tasks.' });
  }
});

// Create a maintenance task
router.post(
  '/',
  authorizeRoles('Admin', 'Maintenance Staff'),
  async (req, res) => {
    try {
      const { title, location, description, priority, status, assignedTo, dueDate } = req.body;

      if (!title || !location) {
        return res.status(400).json({
          message: 'Title and location are required.',
        });
      }

      const task = await Maintenance.create({
        title,
        location,
        description,
        priority,
        status,
        assignedTo,
        dueDate: dueDate || null,
      });

      res.status(201).json({
        message: 'Maintenance task created successfully.',
        task,
      });
    } catch (error) {
      console.error('Create maintenance error:', error.message);
      res.status(400).json({ message: 'Failed to create maintenance task.' });
    }
  }
);

// Update a maintenance task
router.put(
  '/:id',
  authorizeRoles('Admin', 'Maintenance Staff'),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid task ID.' });
      }

      const allowedFields = [
        'title', 'location', 'description',
        'priority', 'status', 'assignedTo', 'dueDate',
      ];

      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const task = await Maintenance.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      res.json({ message: 'Task updated successfully.', task });
    } catch (error) {
      console.error('Update maintenance error:', error.message);
      res.status(400).json({ message: 'Failed to update task.' });
    }
  }
);

// Delete a maintenance task (Admin only)
router.delete(
  '/:id',
  authorizeRoles('Admin'),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid task ID.' });
      }

      const task = await Maintenance.findByIdAndDelete(req.params.id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      res.json({ message: 'Maintenance task deleted successfully.' });
    } catch (error) {
      console.error('Delete maintenance error:', error.message);
      res.status(500).json({ message: 'Failed to delete task.' });
    }
  }
);

module.exports = router;
