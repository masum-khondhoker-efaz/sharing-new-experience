import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { CompanyServices } from './compnay.service';
import { JwtPayload } from 'jsonwebtoken';


// create company
const createCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.createCompanyIntoDb(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Company created successfully',
    data: result,
  });
});

// get company
const getCompany = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyServices.getCompanyFromDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Company retrieved successfully',
    data: result,
  });
});

//get company by id
const getCompanyById = catchAsync(async (req: Request, res: Response) => {
  const companyId = req.params.companyId;
  const result = await CompanyServices.getCompanyByIdFromDb(companyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Company retrieved successfully',
    data: result,
  });
});

// update company
const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const companyId = req.params.companyId;
  const result = await CompanyServices.updateCompanyIntoDb(user, req.body, companyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Company updated successfully',
    data: result,
  });
});

// delete company
const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const companyId = req.params.companyId;
  const result = await CompanyServices.deleteCompanyFromDb( companyId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Company deleted successfully',
    data: result,
  });
});

export const CompanyController = {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  getCompanyById,
};
