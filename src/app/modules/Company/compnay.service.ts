import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { ICompany } from './company.interface';


// create company   
const createCompanyIntoDb = async (user: JwtPayload, payload: ICompany) => {
  const company = await prisma.company.create({
    data: {
      ...payload,
      userId: user.id,
    },
  });
  return company;
};

// get company
const getCompanyFromDb = async () => {
  const company = await prisma.company.findMany();
  return company;
};

// get company by id
const getCompanyByIdFromDb = async (companyId: string) =>
{
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });
  return company;
}


// update company
const updateCompanyIntoDb = async (user: JwtPayload, payload: ICompany, companyId: string) => {
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
const deleteCompanyFromDb = async (companyId: string) =>
{
  const company = await prisma.company.delete({
    where: {
      id: companyId,
    },
  });
  return company;
}

export const CompanyServices = {
  createCompanyIntoDb,
  getCompanyFromDb,
  updateCompanyIntoDb,
  deleteCompanyFromDb,
  getCompanyByIdFromDb
};
