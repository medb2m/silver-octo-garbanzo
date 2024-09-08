import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const regionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  delegations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Delegation' }]
});

export default model('Region', regionSchema);