import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}
import { ReviewController } from './review.controller';
import { reviewValidation } from './review.validation';
import { parseBody } from '../../middlewares/parseBody';
import { multerUpload } from '../../../helpars/multerUpload';

const router = express.Router();

// add review route
router.post(
  '/create-review',
  multerUpload.array('uploadFiles'),
  parseBody,
  validateRequest(reviewValidation.ReviewSchema),
  auth(UserRole.USER),
  ReviewController.addReview
);

// get review route
router.get(
  '/get-review',
  auth(),
  ReviewController.getReview
);

// get all reviews route
router.get(
    '/get-all-reviews/:starrdId',
     auth(UserRole.USER),
     ReviewController.getAllReviews);

// get review by company id
router.get(
  '/get-review/:companyId',
  auth(UserRole.USER),
  ReviewController.getReviewByCompanyId
);


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
