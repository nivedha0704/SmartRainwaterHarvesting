
const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    inspector: {
      type: String,
      required: true,
      trim: true,
    },
    inspectionDate: {
      type: Date,
      default: Date.now,
    },
    condition: {
      type: String,
      enum: ['Good', 'Needs Attention', 'Critical'],
      default: 'Good',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inspection', inspectionSchema);
