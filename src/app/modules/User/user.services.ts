import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiErrors';
import { IUser, IUserFilterRequest } from './user.interface';
import * as bcrypt from 'bcrypt';
import { IPaginationOptions } from '../../../interfaces/paginations';
import { paginationHelper } from '../../../helpars/paginationHelper';
import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
import { userSearchAbleFields } from './user.costant';
import config from '../../../config';
import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpars/jwtHelpers';
import emailSender from '../Auth/emailSender';

// Create a new user in the database.
const createUserIntoDb = async (payload: IUser) => {
  // Check if user already exists by email
  const existingUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      400,
      `User with this email ${payload.email} already exists`
    );
  }

  // Ensure password is provided
  if (!payload.password) {
    throw new ApiError(400, 'Password is required');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  // Create new user
  const result = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  if (!result) {
    throw new ApiError(500, 'Failed to create user');
  }


  const verifyEmailToken = jwtHelpers.generateToken(
    { email: result.email, role: result.role, id: result.id },
    config.jwt.verify_email_secret as Secret,
    config.jwt.verify_email_expires_in as string
  );
  const verifyEmailLink =
    config.jwt.verify_email_link + `?userId=${result.id}&token=${verifyEmailToken}`;
    console.log(verifyEmailLink)

  await emailSender(
    'Verify Your Mail',
    result.email,

    `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
    <table width="100%" style="border-collapse: collapse;">
    <tr>
      <td style="background-color: #007BFF; padding: 20px; text-align: center; color: #ffffff; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Verify Your Email</h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p style="font-size: 16px; margin: 0;">Hello <strong>${
          result.name
        }</strong>,</p>
        <p style="font-size: 16px;">We received a request to reset your password. Please click the button below to proceed with resetting your password.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verifyEmailLink}" style="
              background-color: #007BFF;
              color: white;
              padding: 12px 24px;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
              cursor: pointer;">
            Verify Email
          </a>
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
  return { message: 'Email verify link sent via your email successfully' };


  

};

// reterive all users from the database also searcing anf filetering
const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, 'No active users found');
  }
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// update profile by user won profile uisng token or email and id
const updateProfile = async (user: JwtPayload, payload: IUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!userInfo) {
    throw new ApiError(404, 'User not found');  
  }

  // Update the user profile with the new information
  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      name: payload?.name || userInfo.name,
      profileImage: payload?.profileImage || userInfo.profileImage,
      phoneNumber: payload?.phoneNumber || userInfo.phoneNumber,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update user profile'
    );

  return result;
};

// update user data into database by id fir admin
// const updateUserIntoDb = async (payload: IUser, id: string) => {
//   const userInfo = await prisma.user.findUniqueOrThrow({
//     where: {
//       id: id,
//     },
//   });
//   if (!userInfo)
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found with id: ' + id);

//   const result = await prisma.user.update({
//     where: {
//       id: userInfo.id,
//     },
//     data: payload,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       profileImage: true,
//       role: true,
//       createdAt: true,
//       updatedAt: true,
//     },
//   });

//   if (!result)
//     throw new ApiError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       'Failed to update user profile'
//     );

//   return result;
// };

const verifyEmailFromDb = async (userId:string, token: string) => {
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.verify_email_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
  }

  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  });

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to verify email'
    );
  }

  // Fetch points from PointsLevel where name is "Join into app"
  const point = await prisma.pointsLevel.findFirst({
    where: {
      name: 'Join into app',
    },
    select: {
      points: true,
    },
  });

  // If pointsLevel for "Join into app" not found, throw error
  if (!point) {
    throw new ApiError(404, "Points level 'Join into app' not found");
  }

  // Check if role is USER and update points
  if (result.role === UserRole.USER) {
    // Increment points for the user
    const updatedUser = await prisma.user.update({
      where: { id: result.id },
      data: { points: point.points,
        status: UserStatus.ACTIVE
       },
    });
    const { password, ...user } = updatedUser;
    return {message: 'Email verified successfully!', data: user};
  }

  

  return { message: 'Email verified successfully!', data: result };
}

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  updateProfile,
  // updateUserIntoDb,
  verifyEmailFromDb,
};
