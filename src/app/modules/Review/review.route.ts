import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

import { ReviewController } from './review.controller';
import { reviewValidation } from './review.validation';

const router = express.Router();

// add review route
router.post(
  '/create-review',
  auth(UserRole.USER),
  validateRequest(reviewValidation.ReviewSchema),
  ReviewController.addReview
);

// get review route
router.get(
  '/get-review',
  auth(UserRole.USER),
  ReviewController.getReview
);

// get all reviews route
router.get(
    '/get-all-reviews/:serviceId',
     auth(UserRole.USER),
     ReviewController.getAllReviews);

// update review route
router.put(
  '/update-review/:reviewId',
  auth(UserRole.USER),
  validateRequest(reviewValidation.ReviewSchema),
  ReviewController.updateReview
);

// delete review route
router.delete(
    '/delete-review/:reviewId', 
    auth(UserRole.USER), 
    ReviewController.deleteReview);

export const ReviewRoutes = router;
