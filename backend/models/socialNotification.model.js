import mongoose from 'mongoose';

const { Schema, model } = mongoose

const socialNotificationSchema = new Schema({
  message: { type: String, required: true },
  socialId : { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false }
});

export default model('SocialNotification', socialNotificationSchema);