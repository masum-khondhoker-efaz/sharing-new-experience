import ApiError from '../../../errors/ApiErrors';
import prisma from '../../../shared/prisma';
import { IStarrd } from './starrd.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';


// create starrd
const createStarrdIntoDb = async (user: JwtPayload, starrdData: any) => {
  const { data, uploadFiles } = starrdData;

  const transaction = await prisma.$transaction(async (prisma) => {
    const starrd = await prisma.starrd.create({
      data: {
        name: data.name,
        companyName: data.companyName,
        websiteLink: data.websiteLink,
        personalNote: data.personalNote,
        socialLink: data.socialLink,
        location: data.location as object,
        userId: user.id,
        uploadFiles: uploadFiles,
        categoryName: data.categoryName,
        subCategoryName: data.subCategoryName,
      },
    });

    if (!starrd) throw new Error('Failed to create starrd');

    if (starrd.companyName) {
      let company = await prisma.company.findUnique({
        where: {
          companyName: starrd.companyName,
        },
      });
      if (!company) {
        let categoryId = null;
        if (starrd.categoryName) {
          const category = await prisma.category.findUniqueOrThrow({
            where: {
              categoryName: starrd.categoryName,
            },
          });
          categoryId = category.id;
        }

        company = await prisma.company.create({
          data: {
            companyName: starrd.companyName,
            uploadFiles: uploadFiles,
            websiteLink: starrd.websiteLink,
            socialLink: starrd.socialLink,
            location: starrd.location as object,
            userId: user.id,
            categoryId: categoryId as string,
          },
        });
      }
      await prisma.starrd.update({
        where: {
          id: starrd.id,
        },
        data: {
          companyId: company.id,
        },
      });
    }

    if (starrd.categoryName) {
      const category = await prisma.category.findUniqueOrThrow({
        where: {
          categoryName: starrd.categoryName,
        },
      });
      await prisma.starrd.update({
        where: {
          id: starrd.id,
        },
        data: {
          categoryId: category.id,
        },
      });

      if (starrd.subCategoryName) {
        let subcategory = await prisma.subcategory.findUnique({
          where: {
            subCategoryName: starrd.subCategoryName,
          },
        });
        if (!subcategory) {
          subcategory = await prisma.subcategory.create({
            data: {
              subCategoryName: starrd.subCategoryName,
              categoryId: category.id,
              userId: user.id,
            },
          });
        }
        await prisma.starrd.update({
          where: {
            id: starrd.id,
          },
          data: {
            subCategoryId: subcategory.id,
          },
        });
      }
    }

    // Fetch points from PointsLevel where name is "Join into app"
    const point = await prisma.pointsLevel.findFirst({
      where: {
        OR: [
          { name: 'Add a new item or product' },
          { name: 'Share a place or product' },
        ],
      },
      select: {
        points: true,
      },
    });

    // If pointsLevel for "Join into app" not found, throw error
    if (!point) {
      throw new ApiError(404, "Points level 'Join into app' not found");
    }

    // Increment points for the user
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: point.points } },
    });

    return starrd;
  });

  return transaction;
};

// get starrd
const getStarrdFromDb = async () => {
    const starrd = await prisma.starrd.findMany();
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

// get starrd by company
 const getStarrdByCompanyFromDb = async (user: JwtPayload,companyId: string) => {
  const starrd = await prisma.starrd.findMany({
    where: {
      companyId: companyId,
    },
  });
  return starrd;
}

const updateFavouriteStarrdIntoDb= async (user: JwtPayload, starrdId: string) => {
  const starrd = await prisma.starrd.update({
    where: {
      userId: user.id,
      id: starrdId,
    },
    data: {
      favorite: true,
    },
  });
  return starrd;
}


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


// Get Starrd by Favourite
// const getStarrdByFavouriteFromDb = async () => {
//   const starrd = await prisma.starrd.findMany();
//   if (!starrd) throw new Error('Failed to get starrd');
//   return starrd;
// };

// Get top 10 Starrd by highest reviews
const getStarrdByFavouriteFromDb = async () => {
  const starrd = await prisma.starrd.findMany({
    include: {
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  const starrdWithRatings = await Promise.all(
    starrd.map(async (s) => {
      const avgRating = await prisma.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          starrdId: s.id,
        },
      });

      return {
       ...s,
        _count: s._count.reviews,
        avgRating: avgRating._avg.rating,
      };
    })
  );

  return starrdWithRatings;
};


export const StarrdServices = {
  createStarrdIntoDb,
  getStarrdFromDb,
  updateStarrdIntoDb,
  deleteStarrdFromDb,
  getStarrdByIdFromDb,
  getStarrdByFavouriteFromDb,
  getStarrdByCompanyFromDb,
  updateFavouriteStarrdIntoDb,
};