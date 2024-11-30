import { UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import  config from "../../config";
import bcrypt from "bcrypt";

export const initiateSuperAdmin = async () => {
  const payload: any = {
    name: "Super",
    email: "belalhossain22000@gmail.com",
    phoneNumber: "1234567890",
    password: "12345678",
    role: UserRole.SUPER_ADMIN,
  };
  payload.password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_rounds));
  const isExistUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isExistUser) return;

  await prisma.user.create({
    data: payload,
  });
};
