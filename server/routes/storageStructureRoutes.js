const express = require('express');
const router = express.Router();

const StorageStructure = require('../models/StorageStructure');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Get all storage structures
router.get('/', async (req, res) => {
  try {
    const structures = await StorageStructure.find().sort({ createdAt: -1 });
    res.json(structures);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch storage structures.' });
  }
});

// Add a storage structure
router.post('/', authorizeRoles('Admin'), async (req, res) => {
  try {
    const {
      structureName, location, structureType,
      capacityLitres, waterLevelLitres, condition, description,
    } = req.body;

    if (!structureName || !location || !structureType || capacityLitres === undefined) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const structure = await StorageStructure.create({
      structureName,
      location,
      structureType,
      capacityLitres,
      waterLevelLitres,
      condition,
      description,
    });

    res.status(201).json({ message: 'Storage structure added successfully.', structure });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to add storage structure.' });
  }
});

// Update a storage structure
router.put('/:id', authorizeRoles('Admin'), async (req, res) => {
  try {
    const structure = await StorageStructure.findById(req.params.id);

    if (!structure) {
      return res.status(404).json({ message: 'Storage structure not found.' });
    }

    Object.assign(structure, req.body);
    await structure.save();

    res.json({ message: 'Storage structure updated successfully.', structure });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update storage structure.' });
  }
});

// Delete a storage structure
router.delete('/:id', authorizeRoles('Admin'), async (req, res) => {
  try {
    const structure = await StorageStructure.findByIdAndDelete(req.params.id);

    if (!structure) {
      return res.status(404).json({ message: 'Storage structure not found.' });
    }

    res.json({ message: 'Storage structure deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete storage structure.' });
  }
});

module.exports = router;