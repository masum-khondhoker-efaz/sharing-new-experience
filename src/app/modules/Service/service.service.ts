import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { ICompany } from '../Company/company.interface';


// create company
const createCompanyIntoDb = async (user: JwtPayload, payload: ICompany) => {
  const company = await prisma.service.create({
    data: {
      ...payload,
      userId: user.id,
    },
  });
  return company;
};


// get company
const getCompanyFromDb = async () => {
  const company = await prisma.service.findMany();
  return company;
};

// update company
const updateCompanyIntoDb = async (user: JwtPayload, payload: ICompany, companyId: string) => {
  const company = await prisma.service.update({
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
const deleteCompanyFromDb = async (user: JwtPayload, companyId: string) => {
  const company = await prisma.service.delete({
    where: {
      id: companyId,
      userId: user.id,
    },
  });
  return company;
};

export const CompanyServices = {
  createCompanyIntoDb,
  getCompanyFromDb,
  updateCompanyIntoDb,
  deleteCompanyFromDb,
};
