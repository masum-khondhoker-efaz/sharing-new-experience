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

  if(starrd.companyName) {
    const company =  await prisma.company.findMany({
      where: {
        companyName: starrd.companyName,
      },
    });
    if(!company){
       await prisma.company.create({
         data: {
           companyName: starrd.companyName,
           uploadFiles: starrd.uploadFiles,
           websiteLink: starrd.websiteLink,
           socialLink: starrd.socialLink,
           location: starrd.location as object,
           userId: user.id,
         },
       });
    }
  }
  if(starrd.subCategoryName) {
    const subcategory =  await prisma.subcategory.findMany({
      where: {
        subCategoryName: starrd.subCategoryName,
      },
    });
    if (!subcategory) {
      await prisma.subcategory.create({
        data: {
          subCategoryName: starrd.subCategoryName,
          userId: user.id,
        },
      });
    }
  }

    



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