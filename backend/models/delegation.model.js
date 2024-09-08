import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const delegationSchema = new Schema({
    name: { type: String, required: true },
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }],
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true }
})

export default model('Delegation', delegationSchema);