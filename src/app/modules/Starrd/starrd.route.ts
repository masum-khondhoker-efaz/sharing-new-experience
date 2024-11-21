import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { StarrdController } from './starrd.controller';
import {starrdValidation} from './starrd.validation';

const router = express.Router();



router.post(
    '/create-starrd',
    auth(UserRole.SUPER_ADMIN),
    validateRequest(starrdValidation.starrdValidationSchema),
    StarrdController.createStarrd
);

router.get(
  '/get-starrd',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  StarrdController.getStarrd
);


router.put(
  '/update-starrd/:starrdId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(starrdValidation.starrdValidationSchema),
  StarrdController.updateStarrd
);

router.delete(
  '/delete-starrd/:starrdId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StarrdController.deleteStarrd
);

export const StarrdRoutes = router;
