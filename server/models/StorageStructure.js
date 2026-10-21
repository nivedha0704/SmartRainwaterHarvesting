const mongoose = require('mongoose');

const storageStructureSchema = new mongoose.Schema(
  {
    structureName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    structureType: {
      type: String,
      required: true,
      enum: ['Storage Tank', 'Recharge Pit', 'Sump', 'Reservoir', 'Other'],
    },
    capacityLitres: {
      type: Number,
      required: true,
      min: 1,
    },
    waterLevelLitres: {
      type: Number,
      default: 0,
      min: 0,
    },
    condition: {
      type: String,
      enum: ['Good', 'Needs Attention', 'Critical'],
      default: 'Good',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

storageStructureSchema.pre('validate', function () {
  if (this.waterLevelLitres > this.capacityLitres) {
    this.invalidate(
      'waterLevelLitres',
      'Water level cannot exceed total capacity.'
    );
  }
});
module.exports = mongoose.model('StorageStructure', storageStructureSchema);