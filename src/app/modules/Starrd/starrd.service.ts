import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IStarrd } from './starrd.interface';
import { JwtPayload } from 'jsonwebtoken';


// create starrd
const createStarrdIntoDb = async (user: JwtPayload, payload: IStarrd) => {
    
  const starrd = await prisma.starrd.create({
    data: {
     ...payload,
     userId: user.id,
    },
  });
  if (!starrd) throw new Error('Failed to create starrd');
  return starrd;
};

// get starrd
const getStarrdFromDb = async (user: JwtPayload) => {
    const starrd = await prisma.starrd.findMany({
        where: {
            userId: user.id,
        },
    });
    if (!starrd) throw new Error('Failed to get starrd');
    return starrd;
};

// update starrd
const updateStarrdIntoDb = async (user: JwtPayload, payload: IStarrd, starrdId: string) => {
  const starrd = await prisma.starrd.update({
    where: {
      userId: user.id,
      id: starrdId,
    },
    data: {
      ...payload
  }
});
  return starrd;
};

// delete starrd
const deleteStarrdFromDb = async (user: JwtPayload, starrdId: string) => {
  const starrd = await prisma.starrd.delete({
    where: {
      userId: user.id,
      id: starrdId, 
    },
  });
  return starrd;
};

export const StarrdServices = {
  createStarrdIntoDb,
  getStarrdFromDb,
  updateStarrdIntoDb,
  deleteStarrdFromDb,
};