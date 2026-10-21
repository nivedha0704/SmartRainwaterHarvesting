const mongoose = require('mongoose');

const harvestingSystemSchema = new mongoose.Schema(
  {
    systemName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    collectionMethod: {
      type: String,
      required: true,
      enum: ['Rooftop', 'Surface Runoff', 'Both'],
    },
    capacityLitres: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['Active', 'Needs Maintenance', 'Inactive'],
      default: 'Active',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'HarvestingSystem',
  harvestingSystemSchema
);