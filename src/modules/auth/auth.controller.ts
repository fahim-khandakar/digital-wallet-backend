/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await AuthServices.credentialsLogin(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged In Successfully",
      data: result,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
};
