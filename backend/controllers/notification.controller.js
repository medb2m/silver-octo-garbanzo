import Notification from '../models/notification.model.js';
import SocialNotification from '../models/socialNotification.model.js';
import sendEmail from '../_helpers/send-email.js'

// create notfication for reports
export const createNotification = async (message, userId, reportId, city) => {
  const notification = new Notification({ message, reportId, city, user: userId });
  await notification.save();
};

// create notification for social
export const createSocialNotification = async (message, socialId) => {
  console.log('we in notif contreoller')
const notification = new SocialNotification({ message, socialId });
await notification.save();
};

// get report notfication
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find();
  res.json(notifications);
};

// get social notfication
export const getSocialNotifications = async (req, res) => {
  const notifications = await SocialNotification.find();
  res.json(notifications);
};

// Set report Notification to read
export const setNotificationRead = async (req, res) => {
    const notification = await Notification.findByIdAndUpdate(req.params.notificationId, {isRead : true}, { new: true })
    res.status(204).json(notification)
}

// Set social Notification to read
export const setSocialNotificationRead = async (req, res) => {
  const notification = await SocialNotification.findByIdAndUpdate(req.params.notificationId, {isRead : true}, { new: true })
  res.status(204).json(notification)
}

