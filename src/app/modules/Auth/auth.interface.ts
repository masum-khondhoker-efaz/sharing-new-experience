import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  phoneNumber?: string;
  profileImage?: string;
  fcmToken?: string;
  favorite?: boolean;
  status: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
}