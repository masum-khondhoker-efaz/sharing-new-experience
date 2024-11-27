import { z } from "zod";



const  CreateUserValidationSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),  

  name: z
    .string()
    .min(1, "Name is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),

  phoneNumber: z
  .string()
  .min(9, "Phone number must be at least 10 characters long")
  .nonempty("Phone number is required"),

});

export { CreateUserValidationSchema };
;

const UserLoginValidationSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  profileImage: z.string().url().optional(),
  phoneNumber: z.string().optional(), 
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
  userUpdateSchema,
};
