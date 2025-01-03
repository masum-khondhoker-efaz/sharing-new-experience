import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpars/jwtHelpers';
import prisma from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiErrors';
import emailSender from './emailSender';
import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import httpStatus from 'http-status';
import admin from '../../../helpars/fireBaseAdmin';
import { IUser } from './auth.interface';
import { ObjectId } from 'mongodb';

// user login
const loginUser = async (payload: {
  email: string;
  password: string;
  deviceToken: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found! with this email ' + payload.email
    );
  } else {
    await prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        deviceToken: payload.deviceToken,
      },
    });
  }

  if (!userData.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is missing for this user');
  }
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password incorrect!');
  }
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const { password, ...userWithoutPassword } = userData;
  return { token: accessToken, user: userWithoutPassword };
};

// get user profile
const getMyProfile = async (user: JwtPayload) => {
  

  const userProfile = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      phoneNumber: true,
      serviceViewed: true,
    },
  });

  const starrdDetails = await Promise.all(
    Array.isArray(userProfile?.serviceViewed)
      ? userProfile.serviceViewed.slice(0, 3).map(async (viewed: any) => {
          const service = await prisma.starrd.findUnique({
            where: { id: viewed.id },
            select: {
              id: true, // Include id field here
              uploadFiles: true,
              name: true,
              location: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          // Check if service exists before returning data
          if (service) {
            return {
              id: service.id, 
              uploadFiles: service.uploadFiles || [],
              name: service.name,
              location: service.location,
              createdAt: service.createdAt,
              updatedAt: service.updatedAt,
            };
          }

          return null;
        })
      : []
  );

  if (userProfile) {
    return {
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        profileImage: userProfile.profileImage,
        phoneNumber: userProfile.phoneNumber,
        serviceViewed: starrdDetails.filter((detail) => detail !== null), // Filter out any null values
      },
    };
  }

  return { success: false, message: 'User not found' };
};

// change password
const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user?.password) {
    throw new ApiError(400, 'User password is missing');
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Incorrect old password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: 'Password changed successfully' };
};

//gorget password
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date();
  otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);
  const otpExpiresAtString = otpExpiresAt.toISOString();

  await prisma.user.update({
    where: { email: payload.email },
    data: {
      otp: otp,
      expiresAt: otpExpiresAtString,
    },
  });

  await emailSender(
    'Reset Your Password',
    userData.email,

    `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <table width="100%" style="border-collapse: collapse;">
    <tr>
      <td style="background-color: #007BFF; padding: 20px; text-align: center; color: #ffffff; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Reset Your Password</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p style="font-size: 16px; margin: 0;">Hello <strong>${
          userData.name
        }</strong>,</p>
        <p style="font-size: 16px;">We received a request to reset your password. Please click the button below to proceed with resetting your password.</p>
        <div style="text-align: center; margin: 20px 0;">
          <p>reset password using this OTP: ${otp}, This OTP is Expired in 5 minutes,</p>
        </div>
        <p style="font-size: 14px; color: #555;">If you did not request this change, please ignore this email. No further action is needed.</p>
        <p style="font-size: 16px; margin-top: 20px;">Thank you,<br>StarrdApp</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888; border-radius: 0 0 10px 10px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} StarrdApp Team. All rights reserved.</p>
      </td>
    </tr>
    </table>
  </div>

      `
  );
  return { message: 'Reset password link sent via your email successfully' };
};

// verify otp
const verifyOtpInDB = async (bodyData: { email: string; otp: string }) => {
  const userData = await prisma.user.findUnique({
    where: { email: bodyData.email },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const currentTime = new Date(Date.now());

  if (userData?.otp !== bodyData.otp) {
    throw new ApiError(404, 'Your OTP is incorrect!');
  } else if (!userData.expiresAt || userData.expiresAt <= currentTime) {
    throw new ApiError(409, 'Your OTP is expired, please send new otp');
  }

  return;
};

//reset password for app
const resetPassword = async (payload: {
  email: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      otp: null,
      expiresAt: null,
    },
  });

  return user;
};

// const loginWithGoogleIntoDb = async (payload: IUser) => {
//   if (!payload.fcmToken) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'FCM token is required');
//   }
//   // const decodedToken = await admin.auth().verifyIdToken(payload.fcmToken);
//   // if (!decodedToken) {
//   //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
//   // }
//   let userData = await prisma.user.findUnique({
//     where: {
//       email: payload.email,
//     },
//   });

//   if (!userData?.email) {
//     userData = await prisma.user.create({
//       data: {
//         email: payload.email,
//         name: payload.name,
//         fcmToken: payload.fcmToken,
//       },
//     });
//   }else{
//     await prisma.user.update({
//       where:{
//         email:payload.email
//       },
//       data:{
//         fcmToken:payload.fcmToken
//       }
//     })
//   }

//   const accessToken = jwtHelpers.generateToken(
//     {
//       id: userData.id,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );

//   return { token: accessToken };
// };

// const loginWithFacebookIntoDb = async (payload: User) => {
//   if (!payload.fcmToken) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'FCM token is required');
//   }
//   // const decodedToken = await admin.auth().verifyIdToken(payload.fcmToken);
//   // if (!decodedToken) {
//   //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
//   // }
//   let userData = await prisma.user.findUnique({
//     where: {
//       email: payload.email,
//     },
//   });

//   if (!userData?.email) {
//     userData = await prisma.user.create({
//       data: {
//         email: payload.email,
//         name: payload.name,
//         fcmToken: payload.fcmToken,
//       },
//     });
//   }else{
//     await prisma.user.update({
//       where:{
//         email:payload.email
//       },
//       data:{
//         fcmToken:payload.fcmToken
//       }
//     })
//   }

//   const accessToken = jwtHelpers.generateToken(
//     {
//       id: userData.id,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );

//   return { token: accessToken };
// };

const profileImageUploadIntoDb = async (userToken: string, payload: IUser) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );
  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: payload,
  });

  return updatedUser;
};

export const AuthServices = {
  loginUser,
  getMyProfile,
  changePassword,
  forgotPassword,
  verifyOtpInDB,
  resetPassword,
  profileImageUploadIntoDb,
  // loginWithGoogleIntoDb,
  // loginWithFacebookIntoDb,
};
