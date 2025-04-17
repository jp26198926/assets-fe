
const mongoose = require('mongoose');

const issuanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedReason: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'deleted', 'transferred', 'surrendered'], 
    default: 'active' 
  }
});

module.exports = mongoose.model('Issuance', issuanceSchema);
