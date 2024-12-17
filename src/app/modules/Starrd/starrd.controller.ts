import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { StarrdServices } from './starrd.service';
import { JwtPayload } from 'jsonwebtoken';
import { uploadFileToSpace } from '../../../helpars/multerUpload';

const createStarrd = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const data = req.body;
  const files = req.files as unknown as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new Error('No files found');
  }

  const fileUrls = await Promise.all(
    files.map((file) => uploadFileToSpace(file, 'retire-professional'))
  );

  const starrdData = {
    data,
    uploadFiles: fileUrls, // Pass the files to the service
  };

  const result = await StarrdServices.createStarrdIntoDb(user, starrdData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Starrd created successfully',
    data: result,
  });
});


const getStarrd = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const result = await StarrdServices.getStarrdFromDb();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd retrieved successfully',
        data: result,
    });
})

const getStarrdById = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const starrdId = req.params.starrdId;
    const result = await StarrdServices.getStarrdByIdFromDb(user, starrdId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd retrieved successfully',
        data: result,
    });
});

const getStarrdByCompany = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const companyId = req.params.companyId;
    const result = await StarrdServices.getStarrdByCompanyFromDb(user, companyId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd retrieved successfully',
        data: result,
    });
});

const updateFavouriteStarrd = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const starrdId = req.params.starrdId;
    const result = await StarrdServices.updateFavouriteStarrdIntoDb(user, starrdId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd updated successfully',
        data: result,
    });
});

const updateSponsoredStarrd = catchAsync(
  async (req: Request, res: Response) => {
    const user = req?.user as JwtPayload;
    const starrdId = req.params.starrdId;
    const result = await StarrdServices.updateSponsoredStarrdIntoDb(
      user,
      starrdId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Starrd updated successfully',
      data: result,
    });
  }
);


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

const getStarrdByFavourite = async (req: Request, res: Response) => {
    const result = await StarrdServices.getStarrdByFavouriteFromDb();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Starrd retrieved successfully',
        data: result,
    });
}


export const StarrdController = {
    createStarrd,
    getStarrd,
    updateStarrd,
    deleteStarrd,
    getStarrdById,
    getStarrdByCompany,
    getStarrdByFavourite,
    updateFavouriteStarrd,
    updateSponsoredStarrd,
    
};
