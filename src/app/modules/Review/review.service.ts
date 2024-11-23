import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { IReview } from './review.interface';

// add review into db
const addReviewIntoDb = async (user: JwtPayload, payload: IReview) => {
  if (payload.serviceId) {
    const service = await prisma.service.findUnique({
      where: {
        id: payload.serviceId,
      },
    });
    if (!service) {
      throw new Error('Service Id is wrong');
    }
  } else {
    throw new Error('Service Id is required');
  }
  const review = await prisma.review.create({
    data: {
      ...payload,
      userId: user.id,
    },
  });
   await prisma.service.update({
     data: {
       reviewIds: {
         push: review.id,
       },
     },
     where: {
       id: review.serviceId,
     },
   });
  return review;
};

// get review from db
const getReviewFromDb = async (user: JwtPayload) => {
  const review = await prisma.review.findMany({
    where: {
      userId: user.id,
    },
  });
  return review;
};

// get all reviews from db
const getAllReviewsFromDb = async (serviceId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      serviceId: serviceId,
    },
  });
  return reviews;
};

// update review into db
const updateReviewIntoDb = async (
  user: JwtPayload,
  payload: IReview,
  reviewId: string
) => {
  const review = await prisma.review.update({
    where: {
      id: reviewId,
      userId: user.id,
    },
    data: payload,
    
  });
  return review;
};

// delete review from db
const deleteReviewFromDb = async (user:JwtPayload, reviewId: string) => {
  const review = await prisma.review.delete({
    where: {
      id: reviewId,
      userId: user.id,
    },
  });
  return review;
};

export const ReviewServices = {
  addReviewIntoDb,
  getReviewFromDb,
  getAllReviewsFromDb,
  updateReviewIntoDb,
  deleteReviewFromDb,
};
