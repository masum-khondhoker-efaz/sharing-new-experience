import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { MapServices } from './map.service';


// get companies
const getAllPlaces = catchAsync(async (req: Request, res: Response) => {
//   const user = req?.user as JwtPayload;
 const { latitude, longitude } = req.query;
  const { productName } = req.body;

  try {
    const result = await MapServices.getCompaniesFromDb(
      latitude ? parseFloat(latitude as string) : undefined,
      longitude ? parseFloat(longitude as string) : undefined,
      productName
    );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Companies retrieved successfully',
    data: result,
  });
}
catch (error) {
  sendResponse(res, {
    success: false,
    statusCode: httpStatus.BAD_REQUEST,
    message: (error as Error).message,
    data: {},
    });
  }
});


export const MapController = {
  getAllPlaces,
};