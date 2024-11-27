import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { IReview } from './review.interface';

// add review into db
const addReviewIntoDb = async (user: JwtPayload, payload: IReview) => {
  if (payload.starrdId) {
    const starrd = await prisma.starrd.findUnique({
      where: {
        id: payload.starrdId,
      },
    });
    if (!starrd) {
      throw new Error('Starrd Id is wrong');
    }
  } else {
    throw new Error('Starrd Id is required');
  }
  const review = await prisma.review.create({
    data: {
      ...payload,
      userId: user.id,
    },
  });
   await prisma.starrd.update({
     data: {
       reviewIds: {
         push: review.id,
       },
     },
     where: {
       id: review.starrdId,
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
const getAllReviewsFromDb = async (starrdId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      starrdId: starrdId,
      
    },
  });
  return reviews;
};

// get review by company id
const getReviewByCompanyIdFromDb = async (companyId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      companyId: companyId,
    },
    select: {
      rating: true,
      comment: true,
      images: true,
      userId: true,
      starrdId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const statistics = reviews.reduce(
    (acc: { totalReviews: number; [key: number]: number; totalRating: number }, review: { rating: number }) => {
      acc.totalReviews += 1;
      acc[review.rating] += 1;
      acc.totalRating += review.rating;
      return acc;
    },
    { totalReviews: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, totalRating: 0 }
  );

  const averageRating = statistics.totalReviews ? (statistics.totalRating / statistics.totalReviews) : 0;

  return { averageRating, statistics, reviews };
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
  getReviewByCompanyIdFromDb,
  updateReviewIntoDb,
  deleteReviewFromDb,
};
