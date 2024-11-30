import { Notification } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createNotificationInDB = async (data: Notification) => {
  const notification = await prisma.notification.create({
    data,
  });
  return notification;
};

const getNotificationFromDB = async (notificationId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });
  return notification;
};

const getNotificationsFromDB = async () => {
  const notification = await prisma.notification.findMany();
  return notification;
};

export const notificationServices = {
  createNotificationInDB,
  getNotificationFromDB,
  getNotificationsFromDB,
};
