import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";
import { parse } from "path";
import { parseBody } from "../../middlewares/parseBody";

const router = express.Router();

// *!register user
router.post(
  "/register",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createUser
);

//verify email
router.get(
  "/verify-email",
   userController.verifyEmail
  );

// *!get all  user
router.get("/", userController.getUsers);

// *!profile user
router.put(
  '/profile-update',
  fileUploader.uploadprofileImage,
  parseBody,
  validateRequest(UserValidation.userUpdateSchema),
  auth(),
  userController.updateProfile
);

// *!update  user
// router.put("/:id", userController.updateUser);

export const userRoutes = router;
