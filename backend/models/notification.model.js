import mongoose from 'mongoose';

const { Schema, model } = mongoose

const notificationSchema = new Schema({
  message: { type: String, required: true },
  reportId : { type: String, required: true },
  city : { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default model('Notification', notificationSchema);