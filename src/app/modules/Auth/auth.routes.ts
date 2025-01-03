import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "../User/user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { authValidation } from "./auth.validation";

const router = express.Router();

router.post(
  '/login',
  validateRequest(UserValidation.UserLoginValidationSchema),
  AuthController.loginUser
);
router.post('/logout', AuthController.logoutUser);
router.get('/profile', auth(), AuthController.getMyProfile);
router.put(
  '/change-password',
  auth(),
  validateRequest(authValidation.changePasswordValidationSchema),
  AuthController.changePassword
);
router.post('/forgot-password', AuthController.forgotPassword);
router.put('/verify-otp', AuthController.verifyOtp);
router.put('/reset-password', AuthController.resetPassword);
router.post(
  '/profile-image-upload',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  validateRequest(authValidation.profileImageValidationSchema),
  AuthController.profileImageUpload
);

// router.post(
//   '/login-with-google',
//   AuthController.loginWithGoogle
// )

// router.post(
//   '/login-with-facebook',
//   AuthController.loginWithFacebook
// )

export const AuthRoutes = router;
