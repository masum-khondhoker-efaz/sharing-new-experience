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


  let updatedUser;
  // Check if role is USER and update points
  if (result.role === UserRole.USER) {
    // Increment points for the user
     updatedUser = await prisma.user.update({
      where: { id: result.id },
      data: { points:  point.points },
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        badge: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  return updatedUser;
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
const updateProfile = async (user: IUser, payload: User) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user.email,
      id: user.id,
    },
  });

  if (!userInfo) {
    throw new ApiError(404, 'User not found');
  }

  // Update the user profile with the new information
  const result = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: {
      name: payload.name || userInfo.name,
      email: payload.email || userInfo.email,
      profileImage: payload.profileImage || userInfo.profileImage,
      phoneNumber: payload.phoneNumber || userInfo.phoneNumber,
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
const updateUserIntoDb = async (payload: IUser, id: string) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  if (!userInfo)
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with id: ' + id);

  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: payload,
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

  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update user profile'
    );

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  updateProfile,
  updateUserIntoDb,
};
