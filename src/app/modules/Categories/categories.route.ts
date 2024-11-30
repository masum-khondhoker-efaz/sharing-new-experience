import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { CategoriesController } from './categories.controller';
import { categoryValidation } from './categories.validation';


const router = express.Router();

// add category route
router.post(
  '/create-category',
  auth(UserRole.SUPER_ADMIN),
  validateRequest(categoryValidation.CategorySchema),
  CategoriesController.createCategory
);

// get category route
router.get('/get-categories',
   auth(),
     CategoriesController.getCategory
);

// update category route
router.put(
  '/update-category/:categoryId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(categoryValidation.CategorySchema),
  CategoriesController.updateCategory
);

// delete category route
router.delete(
  '/delete-category/:categoryId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoriesController.deleteCategory
);

// add subcategory route
router.post(
  '/create-subcategory/:categoryId',
  auth(),
  validateRequest(categoryValidation.CategorySchema),
  CategoriesController.createSubcategory
);

// get subcategory route
router.get(
  '/get-subcategory',
  auth(),
  CategoriesController.getSubcategory
);

// update subcategory route
router.put(
  '/update-subcategory/:subcategoryId',
  auth(),
  validateRequest(categoryValidation.CategorySchema),
  CategoriesController.updateSubcategory
);

// delete subcategory route
router.delete(
  '/delete-subcategory/:subcategoryId',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoriesController.deleteSubcategory
);

export const CategoriesRoutes = router;
