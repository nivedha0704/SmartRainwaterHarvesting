const express = require('express');
const router = express.Router();

const HarvestingSystem = require('../models/HarvestingSystem');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Get all harvesting systems
router.get('/', async (req, res) => {
  try {
    const systems = await HarvestingSystem.find().sort({ createdAt: -1 });
    res.json(systems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch harvesting systems.' });
  }
});

// Add a harvesting system
router.post('/', authorizeRoles('Admin'), async (req, res) => {
  try {
    const { systemName, location, collectionMethod, capacityLitres, status, description } = req.body;

    if (!systemName || !location || !collectionMethod || capacityLitres === undefined) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const system = await HarvestingSystem.create({
      systemName,
      location,
      collectionMethod,
      capacityLitres,
      status,
      description,
    });

    res.status(201).json({ message: 'Harvesting system added successfully.', system });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to add harvesting system.' });
  }
});

// Update a harvesting system
router.put('/:id', authorizeRoles('Admin'), async (req, res) => {
  try {
    const system = await HarvestingSystem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!system) return res.status(404).json({ message: 'Harvesting system not found.' });

    res.json({ message: 'Harvesting system updated successfully.', system });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update harvesting system.' });
  }
});

// Delete a harvesting system
router.delete('/:id', authorizeRoles('Admin'), async (req, res) => {
  try {
    const system = await HarvestingSystem.findByIdAndDelete(req.params.id);

    if (!system) return res.status(404).json({ message: 'Harvesting system not found.' });

    res.json({ message: 'Harvesting system deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete harvesting system.' });
  }
});

module.exports = router;