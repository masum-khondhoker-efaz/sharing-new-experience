import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ReviewServices } from './review.service';
import { JwtPayload } from 'jsonwebtoken';
import { uploadFileToSpace } from '../../../helpars/multerUpload';

// add review controller
const addReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
 const data = req.body;
   const files = req.files as unknown as Express.Multer.File[];
 
   if (!files || files.length === 0) {
     throw new Error('No files found');
   }
 
   const fileUrls = await Promise.all(
     files.map((file) => uploadFileToSpace(file, 'retire-professional'))
   );
 
   const reviewData = {
     data,
     uploadFiles: fileUrls, // Pass the files to the service
   };

  const result = await ReviewServices.addReviewIntoDb(user, reviewData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review added successfully',
    data: result,
  });
});

// get review controller
const getReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const result = await ReviewServices.getReviewFromDb(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

// get all reviews controller
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const starrdId = req.params.starrdId;

  const result = await ReviewServices.getAllReviewsFromDb(starrdId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All reviews retrieved successfully',
    data: result,
  });
});
//get review by company id
const getReviewByCompanyId = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const result = await ReviewServices.getReviewByCompanyIdFromDb(companyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

// update review controller
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const reviewId = req.params.reviewId;
  const result = await ReviewServices.updateReviewIntoDb(user, req.body, reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review updated successfully',
    data: result,
  });
});

// delete review controller
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const reviewId = req.params.reviewId;
  const result = await ReviewServices.deleteReviewFromDb(user, reviewId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const ReviewController = {
  addReview,
  getReview,
  getAllReviews,
  getReviewByCompanyId,
  updateReview,
  deleteReview,
};
