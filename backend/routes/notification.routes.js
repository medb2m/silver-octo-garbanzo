import express from 'express'
import authorize from '../_middleware/authorize.js'
import { getNotifications, getSocialNotifications, setNotificationRead, setSocialNotificationRead } from '../controllers/notification.controller.js';

const router = express.Router()

// report
router.get('/', authorize(), getNotifications);
router.put('/read/:notificationId', authorize(), setNotificationRead);

// social
router.get('/social', authorize(), getSocialNotifications);
router.put('/social/read/:notificationId', authorize(), setSocialNotificationRead);

export default router;