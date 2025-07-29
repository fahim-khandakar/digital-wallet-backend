import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../error helpers/appError";
import { IsActive, Role } from "../../shared/types";
import { Wallet } from "../wallet/wallet.model";
import mongoose from "mongoose";

export const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const session = await mongoose.startSession();
  let newUser;

  try {
    session.startTransaction();

    newUser = await User.create(
      [
        {
          email,
          password: hashedPassword,
          ...rest,
        },
      ],
      { session }
    );

    const createdUser = newUser[0];

    await Wallet.create(
      [
        {
          balance: 50,
          owner: createdUser._id,
          ownerType: createdUser.role,
          status: IsActive.ACTIVE,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return createdUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const user = await User.find().select("-password");
  return {
    data: user,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
};
