import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const delegationSchema = new Schema({
    name: { type: String, required: true },
    region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
    cities: [{ type: Schema.Types.ObjectId, ref: 'City', required: true }],
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true }
})

export default model('Delegation', delegationSchema);