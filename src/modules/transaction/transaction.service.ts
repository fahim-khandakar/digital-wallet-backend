import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error helpers/appError";
import { Role, TransactionType } from "../../shared/types";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

const createTransaction = async (
  payload: Partial<ITransaction>,
  user: JwtPayload
) => {
  const data = payload;
  console.log("data", user);
  const isUserExist = await User.findById(user.userId, { new: true }).populate(
    "wallet"
  );

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  let newUpdatedTransaction;

  if (
    isUserExist.role === Role.ADMIN ||
    isUserExist.role === Role.USER ||
    isUserExist.role === Role.AGENT
  ) {
    if (data.type === TransactionType.TOP_UP) {
      await Wallet.findByIdAndUpdate(
        isUserExist.wallet?._id,
        {
          $inc: { balance: data.amount },
        },
        { new: true }
      );

      newUpdatedTransaction = await Transaction.create({
        ...data,
        status: "COMPLETED",
      });
      return newUpdatedTransaction;
    }
  } else {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized for this action"
    );
  }
  if (isUserExist.role === Role.AGENT) {
    if (data.type === TransactionType.CASH_IN && data.sendTo) {
      const receiver = await User.findOne({ phone: data.sendTo }).populate(
        "wallet"
      );
      if (!receiver) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Receiver number does not exist"
        );
      }
      await Wallet.findByIdAndUpdate(
        receiver.wallet?._id,
        {
          $inc: { balance: data.amount },
        },
        { new: true }
      );

      newUpdatedTransaction = await Transaction.create({
        ...data,
        status: "COMPLETED",
      });
      return newUpdatedTransaction;
    }
  } else {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized for this action"
    );
  }
  if (isUserExist.role === Role.AGENT) {
    if (data.type === TransactionType.CASH_OUT && data.sendTo && data.amount) {
      await Wallet.findByIdAndUpdate(
        isUserExist.wallet?._id,
        {
          $inc: { balance: -data.amount },
        },
        { new: true }
      );

      const receiver = await User.findOne({ phone: data.sendTo }).populate(
        "wallet"
      );

      if (!receiver) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Receiver number does not exist"
        );
      }

      await Wallet.findByIdAndUpdate(
        receiver.wallet?._id,
        {
          $inc: { balance: data.amount },
        },
        { new: true }
      );

      newUpdatedTransaction = await Transaction.create({
        ...data,
        status: "COMPLETED",
      });
      return newUpdatedTransaction;
    }
  } else {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your are not authorized for this action"
    );
  }

  if (isUserExist.role === Role.AGENT || isUserExist.role === Role.USER) {
    if (data.type === TransactionType.TRANSFER && data.sendTo && data.amount) {
      await Wallet.findByIdAndUpdate(
        isUserExist.wallet?._id,
        {
          $inc: { balance: -data.amount },
        },
        { new: true }
      );

      const receiver = await User.findOne({ phone: data.sendTo }).populate(
        "wallet"
      );

      if (!receiver) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Receiver number does not exist"
        );
      }

      await Wallet.findByIdAndUpdate(
        receiver.wallet?._id,
        {
          $inc: { balance: data.amount },
        },
        { new: true }
      );

      newUpdatedTransaction = await Transaction.create({
        ...data,
        status: "COMPLETED",
      });
      return newUpdatedTransaction;
    }
  } else {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your are not authorized for this action"
    );
  }
  return newUpdatedTransaction;
};

const updateTransaction = async (
  id: string,
  payload: Partial<ITransaction>,
  decodedToken: JwtPayload
) => {
  const ifTransactionExist = await Transaction.findById({ id });

  if (!ifTransactionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction Not Found");
  }

  if (payload.status) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  const newUpdatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return newUpdatedTransaction;
};

const getAllTransactions = async () => {
  const transaction = await Transaction.find();
  return {
    data: transaction,
  };
};

const getSingleTransaction = async (id: string) => {
  const transaction = await Transaction.findById(id);
  return {
    data: transaction,
  };
};
const getMyTransaction = async (id: string) => {
  const transaction = await Transaction.find({
    user: id,
  });
  return {
    data: transaction,
  };
};

export const TransactionServices = {
  createTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransaction,
  getMyTransaction,
};
