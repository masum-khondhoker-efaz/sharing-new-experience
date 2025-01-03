  import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.costant";
import { JwtPayload } from "jsonwebtoken";
import { uploadFileToSpace } from "../../../helpars/multerUpload";
import { uploadFileToSpaceForUpdate } from "../../../helpars/updateMulterUpload";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Registered successfully!",
    data: result,
  });
});



// get all user form db
const getUsers = catchAsync(async (req: Request, res: Response) => {

  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

  const result = await userService.getUsersFromDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieve successfully!",
    data: result,
  });
});


// get all user form db
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user as JwtPayload;
  const data = req.body;
  const file = req.file;
  // console.log(file, 'check file');
  let profileData = { ...data };
  if (file) {
     const fileUrl = await uploadFileToSpaceForUpdate(
       file,
       'retire-professional',
     );
    profileData.profileImage = fileUrl;
  };
    

  const result = await userService.updateProfile(user, profileData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});


// *! update user role and account status
// const updateUser = catchAsync(async (req: Request, res: Response) => {
// const user = req?.user as JwtPayload;
//   const result = await userService.updateUserIntoDb(user, req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User updated successfully!",
//     data: result,
//   });
// });

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const token = req.query.token as string;
  const result = await userService.verifyEmailFromDb(userId, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email verified successfully!",
    data: result,
  });
});


export const userController = {
  createUser,
  getUsers,
  updateProfile,
  // updateUser,
  verifyEmail
};
