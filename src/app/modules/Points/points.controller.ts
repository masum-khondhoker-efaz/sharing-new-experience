import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PointsServices } from "./points.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createPointDetails = catchAsync(async (req: Request, res: Response) => {
    const result = await PointsServices.createPointDetailsIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Point details created successfully",
        data: result,
    });
});

const getPointDetails = catchAsync(async (req: Request, res: Response) => {
    const result = await PointsServices.getPointDetailsFromDb();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Point details retrieved successfully",
        data: result,
    });
});

const updatePointDetails = catchAsync(async (req: Request, res: Response) => {
    const pointDetailsId = req.params.pointsLevelId;
    const result = await PointsServices.updatePointDetailsIntoDb(req.body, pointDetailsId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Point details updated successfully",
        data: result,
    });
});

const deletePointDetails = catchAsync(async (req: Request, res: Response) => {
    const pointDetailsId = req.params.pointsLevelId;
    const result = await PointsServices.deletePointDetailsFromDb(pointDetailsId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Point details deleted successfully",
        data: result,
    });
});


export const PointsController = {
    createPointDetails,
    getPointDetails,
    updatePointDetails,
    deletePointDetails
};