/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WalletServices } from "./wallet.service";

const createWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = await WalletServices.createWallet(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Wallet Created Successfully",
      data: wallet,
    });
  }
);
const updateWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;
    const wallet = await WalletServices.updateWallet(
      id,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Wallet Updated Successfully",
      data: wallet,
    });
  }
);

const getAllWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await WalletServices.getAllWallets();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Wallets Retrieved Successfully",
      data: result.data,
    });
  }
);
const getMyWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await WalletServices.getMyWallet(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Your wallet Retrieved Successfully",
      data: result.data,
    });
  }
);
const getSingleWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await WalletServices.getSingleWallet(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Wallet Retrieved Successfully",
      data: result.data,
    });
  }
);

export const WalletControllers = {
  createWallet,
  getAllWallets,
  getSingleWallet,
  updateWallet,
  getMyWallet,
};
