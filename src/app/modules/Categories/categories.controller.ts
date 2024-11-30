import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import { CategoriesServices } from './categories.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const result = await CategoriesServices.createCategoryIntoDb(user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoriesServices.getCategoryFromDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const categoryId = req.params.categoryId;
  const result = await CategoriesServices.updateCategoryIntoDb(user, req.body, categoryId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const categoryId = req.params.categoryId;
  const result = await CategoriesServices.deleteCategoryFromDb(user, categoryId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category deleted successfully',
    data: result,
  });
});

const createSubcategory = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const categoryId = req.params.categoryId;
  const result = await CategoriesServices.createSubcategoryIntoDb(user, req.body, categoryId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subcategory created successfully',
    data: result,
  });
});

const getSubcategory = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const result = await CategoriesServices.getSubcategoryFromDb(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Subcategory retrieved successfully',
    data: result,
  });
});

const updateSubcategory = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const subcategoryId = req.params.subcategoryId;
  const result = await CategoriesServices.updateSubcategoryIntoDb(user, req.body, subcategoryId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Subcategory updated successfully',
    data: result,
  });
});

const deleteSubcategory = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const subcategoryId = req.params.subcategoryId;
  const result = await CategoriesServices.deleteSubcategoryFromDb(user, subcategoryId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Subcategory deleted successfully',
    data: result,
  });
});

export const CategoriesController = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
};


