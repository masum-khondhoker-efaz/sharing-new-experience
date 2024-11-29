import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { companyValidation } from './company.validation';
import { CompanyController } from './company.controller';
import { fileUploader } from '../../../helpars/fileUploader';
import { parseBody } from '../../middlewares/parseBody';

const router = express.Router();

router.post(
  '/create-company',
  fileUploader.uploadCompanyImages,
  auth(UserRole.USER),
  parseBody,
  validateRequest(companyValidation.companyValidationSchema),
  CompanyController.createCompany
);

router.get(
  '/get-company',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  CompanyController.getCompany
);

router.get(
  '/get-company-specific/:companyId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  CompanyController.getCompanyById
);

router.put(
    '/update-company/:companyId',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
    validateRequest(companyValidation.companyValidationSchema),
    CompanyController.updateCompany
    );

router.delete(
    '/delete-company/:companyId',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    CompanyController.deleteCompany
);

export const CompanyRoutes = router;
