import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { notificationServices } from './notification.service';

// add review controller
const createNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.createNotificationInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Notification created successfully',
    data: result,
  });
});

//get review by company id
const getNotification = catchAsync(async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId;
  const result = await notificationServices.getNotificationFromDB(
    notificationId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notification retrieved successfully',
    data: result,
  });
});

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.getNotificationsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Notification retrieved successfully',
    data: result,
  });
});

export const notificationController = {
  createNotification,
  getNotification,
  getNotifications,
};
