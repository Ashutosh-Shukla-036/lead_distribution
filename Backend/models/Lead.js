import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const leadSchema = new Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, default: '' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'Agent', default: null },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default model('Lead', leadSchema);
