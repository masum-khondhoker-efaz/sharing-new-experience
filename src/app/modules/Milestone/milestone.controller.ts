import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { MilestoneServices } from './milestone.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createMilestoneDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await MilestoneServices.createMilestoneDetailsIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Point details created successfully',
    data: result,
  });
});

const getMilestoneDetails = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MilestoneServices.getMilestoneDetailsFromDb();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Point details retrieved successfully',
      data: result,
    });
  }
);

const updateMilestoneDetails = catchAsync(
  async (req: Request, res: Response) => {
    const pointDetailsId = req.params.milestoneId;
    const result = await MilestoneServices.updateMilestoneDetailsIntoDb(
      req.body,
      pointDetailsId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Point details updated successfully',
      data: result,
    });
  }
);

const deleteMilestoneDetails = catchAsync(
  async (req: Request, res: Response) => {
    const pointDetailsId = req.params.milestoneId;
    const result = await MilestoneServices.deleteMilestoneDetailsFromDb(
      pointDetailsId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Point details deleted successfully',
      data: result,
    });
  }
);

export const PointsController = {
    createMilestoneDetails,
    getMilestoneDetails,
    updateMilestoneDetails,
    deleteMilestoneDetails,
};
