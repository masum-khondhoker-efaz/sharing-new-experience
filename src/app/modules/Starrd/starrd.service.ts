import prisma from '../../../shared/prisma';
import { IStarrd } from './starrd.interface';
import { JwtPayload } from 'jsonwebtoken';


// create starrd
const createStarrdIntoDb = async (user: JwtPayload, payload: IStarrd) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    
    const starrd = await prisma.starrd.create({
      data: {
        ...payload,
        userId: user.id,
      },
    });
    
    if (!starrd) throw new Error('Failed to create starrd');

    if (starrd.companyName) {
      const company = await prisma.company.findMany({
        where: {
          companyName: starrd.companyName,
        },
      });
      if (!company.length) {
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

    if (starrd.categoryName) {
      const category = await prisma.category.findUniqueOrThrow({
        where: {
          categoryName: starrd.categoryName,
        },
      });
      console.log('object', category);

      if (starrd.subCategoryName) {
        const subcategory = await prisma.subcategory.findMany({
          where: {
            subCategoryName: starrd.subCategoryName,
          },
        });
        if (!subcategory.length) {
          await prisma.subcategory.create({
            data: {
              subCategoryName: starrd.subCategoryName,
              categoryId: category.id,
              userId: user.id,
            },
          });
        }
      }
    }

    return starrd;
  });

  return transaction;
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

// get starrd by id
// const getStarrdByIdFromDb = async (user: JwtPayload, starrdId: string) => {
//   const starrd = await prisma.starrd.findUnique({
//     where: {
//       userId: user.id,
//       id: starrdId,
//     },
//   });
//   await prisma.user.update({
//     where: {
//       id: user.id,
//     },
//     data: {
//       serviceViewed: {
//         push: {
//           id: starrdId,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       },
//     },
//   });

//   if (!starrd) throw new Error('Failed to get starrd');
//   return starrd;
// };

const getStarrdByIdFromDb = async (user: JwtPayload, starrdId: string) => {
  if (!user?.id || !starrdId) {
    throw new Error('Invalid input: user ID and starrd ID are required.');
  }

  const timestamp = new Date().toISOString();

  // Use a transaction for atomicity
  const result = await prisma.$transaction(async (prisma) => {
    // Fetch the Starrd record
    const starrd = await prisma.starrd.findUnique({
      where: {
        userId: user.id,
        id: starrdId,
      },
    });

    if (!starrd) {
      throw new Error('Starrd not found.');
    }

    // Fetch the current serviceViewed JSON
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
      select: { serviceViewed: true },
    });

    // Ensure serviceViewed is an array
    let serviceViewed = Array.isArray(userRecord?.serviceViewed)
      ? [...userRecord.serviceViewed]
      : [];

    // Check if the entry exists
    const existingIndex = serviceViewed.findIndex(
      (item: any) => item.id === starrdId
    );

    if (existingIndex >= 0) {
      // Update the existing entry
      serviceViewed[existingIndex] = {
        id: starrdId, // Include the id field
        createdAt: (serviceViewed[existingIndex] as { createdAt: string }).createdAt, // Keep the original createdAt
        updatedAt: timestamp, // Update the updatedAt to the new timestamp
      };

      // Move the updated entry to the front (LIFO behavior)
      const [updatedEntry] = serviceViewed.splice(existingIndex, 1);
      serviceViewed.unshift(updatedEntry);
    } else {
      // Add a new entry to the front
      serviceViewed.unshift({
        id: starrdId,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    // Limit the array size
    const MAX_HISTORY_LENGTH = 50;
    if (serviceViewed.length > MAX_HISTORY_LENGTH) {
      serviceViewed = serviceViewed.slice(0, MAX_HISTORY_LENGTH); // Keep only the most recent entries
    }

    // Update the serviceViewed field in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { serviceViewed },
    });

    return starrd;
  });

  return result;
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
  getStarrdByIdFromDb
};