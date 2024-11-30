import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import config from '../../../config';
import ApiError from '../../../errors/ApiErrors';

// create company
const createCompanyIntoDb = async (req: any) => {
  const files = req.files;
 
  const uploadFiles = files?.uploadFiles || [];


  if (!files || files.length === 0) {
    throw new ApiError(400, 'Please upload at least one file');
  }

  const imageUrls = uploadFiles.map((e: any) => {
    const result = e
      ? `${config.backend_base_url}/uploads/${e.filename}`
      : null;
    return result;
  });

  const userId = req.user.id;
  const payload = req.body;
  const company = await prisma.company.create({
    data: {
      ...payload,
      userId: userId,
      uploadFiles: imageUrls,
      
    },
  });
  return company;
};

// get company
const getCompanyFromDb = async () => {
  const company = await prisma.company.findMany({
    include: {
      category: {
        select: {
          companies: {
            select: {
              id: true,
              companyName: true,
              reviews: {
                select: {
                  rating: true,
                },
              },
              location: true,
            },
          },
        },
      },
    },
  });
  return company;
};

// get company by id
const getCompanyByIdFromDb = async (companyId: string) => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      category: {
        select: {
          companies: {
            select: {
              id: true,
              companyName: true,
              reviews: {
                select: {
                  rating: true,
                },
              },
              location: true,
            },
          },
        },
      },
    },
  });
  return company;
};

// update company
const updateCompanyIntoDb = async (
  user: JwtPayload,
  payload: any,
  companyId: string
) => {
  const company = await prisma.company.update({
    where: {
      id: companyId,
      userId: user.id,
    },
    data: {
      ...payload,
    },
  });
  return company;
};

// delete company
const deleteCompanyFromDb = async (companyId: string) => {
  const company = await prisma.company.delete({
    where: {
      id: companyId,
    },
  });
  return company;
};

export const CompanyServices = {
  createCompanyIntoDb,
  getCompanyFromDb,
  updateCompanyIntoDb,
  deleteCompanyFromDb,
  getCompanyByIdFromDb,
};
