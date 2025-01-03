import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { string } from "zod";
import { JwtPayload } from "jsonwebtoken";

//login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  res.cookie("token", result.token, { httpOnly: true });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

//logout user
const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Successfully logged out",
    data: null,
  });
});

// get user profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
   const user = req?.user as JwtPayload;
  const result = await AuthServices.getMyProfile(user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userToken = req.headers.authorization;
  const { oldPassword, newPassword } = req.body;

  const result = await AuthServices.changePassword(
    userToken as string,
    newPassword,
    oldPassword
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

// forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Please check your email to reset password!",
  })
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.verifyOtpInDB(req.body);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP verified successfully!",
  })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.resetPassword(req.body);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Reset Successfully!",
  })
});

// const loginWithGoogle = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.loginWithGoogleIntoDb(req.body);
//   res.cookie("token", result.token, { httpOnly: true });
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User logged in successfully",
//     data: result,
//   });
// });

// const loginWithFacebook = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.loginWithFacebookIntoDb(req.body);
//   res.cookie("token", result.token, { httpOnly: true });
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User logged in successfully",
//     data: result,
//   });
// });


const profileImageUpload = catchAsync(async (req: Request, res: Response) => {
  const userToken = req.headers.authorization;
  const result = await AuthServices.profileImageUploadIntoDb(userToken as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile image uploaded successfully",
    data: result,
  });
}
);

export const AuthController = {
  loginUser,
  logoutUser,
  getMyProfile,
  changePassword,
  forgotPassword,
  verifyOtp,
  resetPassword,
  profileImageUpload,
};
