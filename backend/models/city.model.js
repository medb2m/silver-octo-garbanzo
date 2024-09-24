import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const citySchema = new Schema({
  name: { type: String, required: true },
  delegation: { type: Schema.Types.ObjectId, ref: 'Delegation', required: true },
  workers: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
})

export default model('City', citySchema);