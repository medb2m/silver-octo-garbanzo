import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ReportSchema = new Schema({
  worker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now, required: true },
  content: { type: String, required: true },
  traiter: {type:Boolean, default: false},
  images: [String],  // Array of image URLs
  region: { type: Schema.Types.ObjectId, ref: 'Region' },
  images: [String],
  city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  worker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  delegation: { type: Schema.Types.ObjectId, ref: 'Delegation', required: true },
  // New fields for important report
  important: { type: Boolean, default: false },
  importanceLevel: { type: String, enum: ['high', 'medium', 'low'] },
  importantDescription: { type: String },
}, { timestamps: true });
export default model('Report', ReportSchema);