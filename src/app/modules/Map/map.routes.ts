import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

import { MapController } from './map.controller';
import { mapValidation } from './map.validation';

const router = express.Router();

// get map details route
router.get(
  '/get-all-places',
  auth(),
  MapController.getAllPlaces
);

export const MapRoutes = router;
