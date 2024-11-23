import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { CompanyServices } from './service.service';
import { JwtPayload } from 'jsonwebtoken';


// create service
const createService = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const result = await CompanyServices.createServiceIntoDb(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

// get service
const getService = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.getServiceFromDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service retrieved successfully',
    data: result,
  });
});

// update service
const updateService = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const companyId = req.params.serviceId;
  const result = await CompanyServices.updateServiceIntoDb(
    user,
    req.body,
    companyId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service updated successfully',
    data: result,
  });
});

// delete service
const deleteService = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const companyId = req.params.serviceId;
  const result = await CompanyServices.deleteServiceFromDb(user, companyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const ServiceController = {
    createService,
    getService,
    updateService,
    deleteService,
};