import { z } from "zod";

const changePasswordValidationSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const profileImageValidationSchema = z.object({
  profileImage: z.string().url().optional(),
});

export const authValidation = {
  changePasswordValidationSchema,
  profileImageValidationSchema,
};


