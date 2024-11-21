import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { StarrdServices } from './starrd.service';
import { JwtPayload } from 'jsonwebtoken';

const createStarrd = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const result = await StarrdServices.createStarrdIntoDb(user,req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Starrd created successfully',
        data: result,
    });
})


const getStarrd = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const result = await StarrdServices.getStarrdFromDb(user);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd retrieved successfully',
        data: result,
    });
})

const updateStarrd = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const starrdId = req.params.starrdId;
    const result = await StarrdServices.updateStarrdIntoDb(user,req.body, starrdId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd updated successfully',
        data: result,
    });
})


const deleteStarrd = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const starrdId = req.params.starrdId;
    const result = await StarrdServices.deleteStarrdFromDb(user, starrdId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd deleted successfully',
        data: result,
    });
})

export const StarrdController = {
    createStarrd,
    getStarrd,
    updateStarrd,
    deleteStarrd,
};
