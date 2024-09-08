import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const citySchema = new Schema({
  name: { type: String, required: true },
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  delegation: { type: mongoose.Schema.Types.ObjectId, ref: 'Delegation', required: true }
})

export default model('City', citySchema);