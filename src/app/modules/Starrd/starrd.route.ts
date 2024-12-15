import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { StarrdController } from './starrd.controller';
import {starrdValidation} from './starrd.validation';
import { fileUploader } from '../../../helpars/fileUploader';
import { parse } from 'path';
import { parseBody } from '../../middlewares/parseBody';
import { multerUpload } from '../../../helpars/multerUpload';

const router = express.Router();



router.post(
  '/create-starrd',
  multerUpload.array('uploadFiles'),
  parseBody,
  validateRequest(starrdValidation.starrdValidationSchema),
  auth(UserRole.USER),
  StarrdController.createStarrd
);

router.get(
  '/get-starrd',
  auth(),
  StarrdController.getStarrd
);

router.get(
  '/get-favourite-starrd',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  StarrdController.getStarrdByFavourite
);

router.get(
  '/get-starrd/:starrdId',
  auth(),
  StarrdController.getStarrdById
);

router.get(
  '/get-starrd-by-company/:companyId',
  auth(UserRole.USER),
  StarrdController.getStarrdByCompany
);

router.patch(
  '/add-favourite/:starrdId',
  auth(),
  validateRequest(starrdValidation.starrdFavoriteValidation),
  StarrdController.updateFavouriteStarrd
);

router.put(
  '/update-starrd/:starrdId',
  auth(),
  validateRequest(starrdValidation.starrdValidationSchema),
  StarrdController.updateStarrd
);

router.delete(
  '/delete-starrd/:starrdId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StarrdController.deleteStarrd
);

export const StarrdRoutes = router;
