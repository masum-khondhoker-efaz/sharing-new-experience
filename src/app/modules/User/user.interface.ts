import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  email: string;
  name: string;
  profileImage?: string;
  phoneNumber?: string;
  password: string;
  role: UserRole;
  points?: number;
  badge?: string;
  favorite?: boolean;
  fcmToken?: string;
  deviceToken: string;
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