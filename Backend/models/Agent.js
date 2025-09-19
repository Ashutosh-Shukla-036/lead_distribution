import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const agentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true } // hashed
}, { timestamps: true });

export default model('Agent', agentSchema);
