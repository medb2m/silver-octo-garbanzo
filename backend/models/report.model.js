import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ReportSchema = new Schema({
  worker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now, required: true },
  content: { type: String, required: true },
  machaghel : String,
  machakel_alyawm : String,
  houloul : String,
  concurence : Boolean,
  concurrenceDetails : String,
  propositions : String,
  traiter: {type:Boolean, default: false},
  images: [String]  // Array of image URLs
}, { timestamps: true });

export default model('Report', ReportSchema);
