import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpars/jwtHelpers';
import prisma from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiErrors';
import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import httpStatus from 'http-status';
import admin from '../../../helpars/fireBaseAdmin';
import { IPointsLevel } from './points.interface';


// add points level
const createPointDetailsIntoDb = async (payload: IPointsLevel) => {
  const pointDetails = await prisma.pointsLevel.create({
    data: {
      name: payload.name,
      points: payload.points,
    },
  });
  return pointDetails;
};


// get point details
const getPointDetailsFromDb = async () => {
  const pointDetails = await prisma.pointsLevel.findMany();
  return pointDetails;
};

// update point details
const updatePointDetailsIntoDb = async (payload: IPointsLevel,pointDetailsId: string) => {
  const pointDetails = await prisma.pointsLevel.update({
    where: {
      id: pointDetailsId,
    },
    data: {
      name: payload.name,
      points: payload.points,
    },
  });
  return pointDetails;
};

// delete point details
const deletePointDetailsFromDb = async (pointdeatilsId : string) => {
  const pointDetails = await prisma.pointsLevel.delete({
    where: {
      id: pointdeatilsId,
    },
  });
  return pointDetails;
};

export const PointsServices = {
  createPointDetailsIntoDb,
  getPointDetailsFromDb,
  updatePointDetailsIntoDb,
  deletePointDetailsFromDb,
};