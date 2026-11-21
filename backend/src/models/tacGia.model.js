const mongoose = require('mongoose');

const tacGiaSchema = new mongoose.Schema({
  maTG: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  tenTG: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TacGia', tacGiaSchema);
