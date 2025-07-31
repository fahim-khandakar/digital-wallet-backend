/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TransactionServices } from "./transaction.service";

const createTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.id;
    const transaction = await TransactionServices.createTransaction(
      req.body,
      user
    );
    console.log("user", user);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Transaction Created Successfully",
      data: transaction,
    });
  }
);
const updateTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const payload = req.body;
    const transaction = await TransactionServices.updateTransaction(
      id,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Transaction Updated Successfully",
      data: transaction,
    });
  }
);

const getAllTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionServices.getAllTransactions();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Transactions Retrieved Successfully",
      data: result.data,
    });
  }
);
const getMyTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await TransactionServices.getMyTransaction(decodedToken.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Your transactions Retrieved Successfully",
      data: result.data,
    });
  }
);
const getSingleTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await TransactionServices.getSingleTransaction(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Transaction Retrieved Successfully",
      data: result.data,
    });
  }
);

export const TransactionControllers = {
  createTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransaction,
  getMyTransactions,
};
