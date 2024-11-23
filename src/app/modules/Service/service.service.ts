import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { IService } from './service.interface';


// create service
const createServiceIntoDb = async (user: JwtPayload, payload: IService) => {
  const service = await prisma.service.create({
    data: {
      ...payload,
      userId: user.id,
    },
  });
  return service;
};


// get service
const getServiceFromDb = async () => {
  const service = await prisma.service.findMany();
  return service;
};

// update service
const updateServiceIntoDb = async (
  user: JwtPayload,
  payload: IService,
  serviceId: string
) => {
  const service = await prisma.service.update({
    where: {
      id: serviceId,
      userId: user.id,
    },
    data: {
      ...payload,
    },
  });
  return service;
};

// delete service
const deleteServiceFromDb = async (user: JwtPayload, serviceId: string) => {
  const service = await prisma.service.delete({
    where: {
      id: serviceId,
      userId: user.id,
    },
  });
  return service;
};

export const CompanyServices = {
  createServiceIntoDb,
  getServiceFromDb,
  updateServiceIntoDb,
  deleteServiceFromDb,

};
