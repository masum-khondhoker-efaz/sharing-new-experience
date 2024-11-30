import express from 'express';
import { notificationController } from './notification.controller';

const router = express.Router();

// add notification route
router.post('/create', notificationController.createNotification);

// get notification route
router.get('/:notificationId', notificationController.getNotification);

// get notifications route
router.get('/', notificationController.getNotifications);

export const notificationRoute = router;
