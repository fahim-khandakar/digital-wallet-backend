import { Types } from "mongoose";
import { IsActive, Role } from "../../shared/types";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone: string;
  picture?: string;
  address?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  wallet?: Types.ObjectId;
  transactions?: Types.ObjectId[];
}
