import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PointsController } from './milestone.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { milestoneValidation } from './milestone.validation';

const router = express.Router();

// add milestone details route
router.post(
  '/create-milestone-details',
  auth(UserRole.SUPER_ADMIN),
  validateRequest(milestoneValidation.MilestoneValidationSchema),
  PointsController.createMilestoneDetails
);

// get milestone details route
router.get('/get-milestone-details',
     PointsController.getMilestoneDetails
);

// update milestone details route
router.put(
  '/update-milestone-details/:milestoneId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(milestoneValidation.MilestoneValidationSchema),
  PointsController.updateMilestoneDetails
);

// delete milestone details route
router.delete(
  '/delete-milestone-details/:milestoneId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PointsController.deleteMilestoneDetails
);

export const MilestoneRoutes = router;