import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PointsController } from './points.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { pointsValidation } from './points.validation';

const router = express.Router();

// add point details route
router.post(
  '/create-point-details',
  auth(UserRole.SUPER_ADMIN),
  validateRequest(pointsValidation.PointsLevelValidationSchema),
  PointsController.createPointDetails
);

// get point details route
router.get('/get-point-details',
     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
     PointsController.getPointDetails
);

// update point details route
router.put(
  '/update-point-details/:pointsLevelId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(pointsValidation.PointsLevelValidationSchema),
  PointsController.updatePointDetails
);

// delete point details route
router.delete(
  '/delete-point-details/:pointsLevelId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PointsController.deletePointDetails
);

export const PointRoutes = router;
