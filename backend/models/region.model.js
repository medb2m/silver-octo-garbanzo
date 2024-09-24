import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const regionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  delegations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Delegation' }],
  // Stats attribute to track report information
  stats: {
    totalReports: { type: Number, default: 0 },  // Total report count in the region
    reportDetails: [{
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },  // Reference to Report
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },      // User who created the report
      delegationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delegation' }, // Delegation for the report
      cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }       // City for the report
    }]
  }
});

export default model('Region', regionSchema);