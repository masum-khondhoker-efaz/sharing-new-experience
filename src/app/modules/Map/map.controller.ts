import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { MapServices } from './map.service';


// get companies
const getAllPlaces = catchAsync(async (req: Request, res: Response) => {
//   const user = req?.user as JwtPayload;
  const latitude = Number(req.params.latitude);
  const longitude = Number(req.params.longitude);
  const result = await MapServices.getCompaniesFromDb(
    latitude,
    longitude
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Companies retrieved successfully',
    data: result,
  });
});

export const MapController = {
  getAllPlaces,
};