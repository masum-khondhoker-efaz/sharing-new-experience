import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { serviceValidation } from './service.validation';
import { ServiceController } from './service.controller';

const router = express.Router();

// create service
router.post(
  '/create-service',
  auth(UserRole.USER),
  validateRequest(serviceValidation.serviceValidationSchema),
  ServiceController.createService
);

// get service
router.get(
  '/get-service',
  auth(),
  ServiceController.getService
);

// update service
router.put(
    '/update-service/:serviceId',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
    validateRequest(serviceValidation.serviceValidationSchema),
    ServiceController.updateService
    );

// delete service
router.delete(
    '/delete-service/:serviceId',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
    ServiceController.deleteService
);

export const ServiceRoutes = router;

