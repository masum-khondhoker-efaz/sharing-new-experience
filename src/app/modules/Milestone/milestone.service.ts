import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpars/jwtHelpers';
import prisma from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiErrors';
import { Prisma, User, UserRole, UserStatus } from '@prisma/client';
import httpStatus from 'http-status';
import admin from '../../../helpars/fireBaseAdmin';
import { IMilestone } from './milestone.interface';


// add milestone level
const createMilestoneDetailsIntoDb = async (payload: IMilestone) => {
  const milestoneDetails = await prisma.milestone.create({
    data: {
      name: payload.name,
      points: payload.points,
      badge: payload.badge,
    },
  });
  return milestoneDetails;
};

// get milestone details
const getMilestoneDetailsFromDb = async () => {
  const milestoneDetails = await prisma.milestone.findMany();
  return milestoneDetails;
};

// update milestone details
const updateMilestoneDetailsIntoDb = async (payload: IMilestone, milestoneId: string) => {
  const milestoneDetails = await prisma.milestone.update({
    where: {
      id: milestoneId,
    },
    data: {
      name: payload.name,
      points: payload.points,
      badge: payload.badge,
    },
  });
  return milestoneDetails;
};

// delete milestone details
const deleteMilestoneDetailsFromDb = async (milestoneId: string) => {
  const milestoneDetails = await prisma.milestone.delete({
    where: {
      id: milestoneId,
    },
  });
  return milestoneDetails;
};

export const MilestoneServices = {
  createMilestoneDetailsIntoDb,
  getMilestoneDetailsFromDb,
  updateMilestoneDetailsIntoDb,
  deleteMilestoneDetailsFromDb,
};