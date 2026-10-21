const express = require('express');
const mongoose = require('mongoose');
const Inspection = require('../models/Inspection');
const {
  authMiddleware,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get all inspections
router.get('/', async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 });
    res.json(inspections);
  } catch (error) {
    console.error('Fetch inspections error:', error);
    res.status(500).json({ message: 'Failed to fetch inspections.' });
  }
});

// Create an inspection
router.post(
  '/',
  authorizeRoles('Admin', 'Inspector'),
  async (req, res) => {
    try {
      const { location, inspector, condition, notes } = req.body;

      if (!location || !inspector) {
        return res.status(400).json({
          message: 'Location and inspector name are required.',
        });
      }

      const inspection = await Inspection.create({
        location,
        inspector,
        condition: condition || 'Good',
        notes: notes || '',
      });

      return res.status(201).json({
        message: 'Inspection recorded successfully.',
        inspection,
      });
    } catch (error) {
      console.error('Create inspection error:', error);
      return res.status(500).json({
        message: 'Failed to create inspection.',
      });
    }
  }
);

// Delete an inspection
router.delete(
  '/:id',
  authorizeRoles('Admin'),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid inspection ID.' });
      }

      const inspection = await Inspection.findByIdAndDelete(req.params.id);

      if (!inspection) {
        return res.status(404).json({ message: 'Inspection not found.' });
      }

      return res.json({ message: 'Inspection deleted successfully.' });
    } catch (error) {
      console.error('Delete inspection error:', error);
      return res.status(500).json({
        message: 'Failed to delete inspection.',
      });
    }
  }
);

module.exports = router;