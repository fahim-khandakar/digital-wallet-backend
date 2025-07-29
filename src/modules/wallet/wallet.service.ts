import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error helpers/appError";
import { Role } from "../../shared/types";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const createWallet = async (payload: Partial<IWallet>) => {
  const { owner, ...rest } = payload;

  const isOwnerHasWallet = await Wallet.findOne({ owner });

  if (isOwnerHasWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already you have an account!");
  }

  const wallet = await Wallet.create({
    owner,
    ...rest,
  });

  return wallet;
};

const updateWallet = async (
  id: string,
  payload: Partial<IWallet>,
  decodedToken: JwtPayload
) => {
  const ifWalletExist = await Wallet.findById({ id });

  if (!ifWalletExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found");
  }

  if (payload.status) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.ownerType) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedWallet = await Wallet.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedWallet;
};

const getAllWallets = async () => {
  const wallet = await Wallet.find();
  return {
    data: wallet,
  };
};

const getSingleWallet = async (id: string) => {
  const wallet = await Wallet.findById(id);
  return {
    data: wallet,
  };
};
const getMyWallet = async (id: string) => {
  const wallet = await Wallet.findById(id);
  return {
    data: wallet,
  };
};

export const WalletServices = {
  createWallet,
  getAllWallets,
  getSingleWallet,
  updateWallet,
  getMyWallet,
};
