import httpStatus from "http-status-codes";
import AppError from "../../error helpers/appError";
import { Role, TransactionStatus, TransactionType } from "../../shared/types";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { IWallet } from "../wallet/wallet.interface";
import mongoose from "mongoose";

const createTransaction = async (
  payload: Partial<ITransaction>,
  user: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = payload;
    const isUserExist = await User.findById(user)
      .populate("wallet")
      .select("role phone")
      .session(session);

    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    }

    const currentUserWallet = isUserExist.wallet as unknown as IWallet;

    let newUpdatedTransaction = null;

    if (data.type === TransactionType.TOP_UP) {
      await Wallet.findByIdAndUpdate(
        isUserExist.wallet?._id,
        { $inc: { balance: data.amount } },
        { new: true, session }
      );

      newUpdatedTransaction = await Transaction.create(
        [
          {
            ...data,
            user: isUserExist._id,
            sendTo: isUserExist._id,
            status: "COMPLETED",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return newUpdatedTransaction[0];
    }

    if (
      data.type === TransactionType.CASH_IN &&
      data.amount &&
      (isUserExist.role === Role.ADMIN || isUserExist.role === Role.AGENT)
    ) {
      const receiver = await User.findOne({ phone: data.sendTo })
        .populate("wallet")
        .session(session);

      if (!receiver) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Receiver number does not exist"
        );
      }

      if (currentUserWallet.balance < data.amount) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Insufficient balance to complete the transaction."
        );
      }

      if (isUserExist.phone === String(data.sendTo)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You can't transaction in same account"
        );
      }

      await Wallet.findByIdAndUpdate(
        isUserExist.wallet?._id,
        { $inc: { balance: -data.amount } },
        { session }
      );

      await Wallet.findByIdAndUpdate(
        receiver.wallet?._id,
        { $inc: { balance: data.amount } },
        { session }
      );

      newUpdatedTransaction = await Transaction.create(
        [
          {
            ...data,
            user: isUserExist._id,
            sendTo: receiver._id,
            status: "COMPLETED",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return newUpdatedTransaction[0];
    }

    if (
      data.type === TransactionType.CASH_OUT &&
      data.amount &&
      (isUserExist.role === Role.ADMIN || isUserExist.role === Role.AGENT)
    ) {
      const receiver = await User.findOne({ phone: data.sendTo })
        .populate("wallet")
        .session(session);

      if (!receiver) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Receiver number does not exist"
        );
      }

      if (currentUserWallet.balance < data.amount) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Insufficient balance to complete the transaction."
        );
      }

      if (isUserExist.phone === String(data.sendTo)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You can't transaction in same account"
        );
      }

      if (receiver.role !== Role.AGENT) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Your receiver is not an agent!"
        );
      }

      await Wallet.findByIdAndUpdate(
        isUserExist.wallet?._id,
        { $inc: { balance: -data.amount } },
        { session }
      );
      await Wallet.findByIdAndUpdate(
        receiver.wallet?._id,
        { $inc: { balance: data.amount } },
        { session }
      );

      newUpdatedTransaction = await Transaction.create(
        [
          {
            ...data,
            user: isUserExist._id,
            sendTo: receiver._id,
            status: "COMPLETED",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return newUpdatedTransaction[0];
    }

    if (data.type === TransactionType.TRANSFER && data.sendTo && data.amount) {
      const receiver = await User.findOne({ phone: data.sendTo })
        .populate("wallet")
        .select("phone role")
        .session(session);

      if (!receiver) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Receiver number does not exist"
        );
      }

      if (receiver.phone === isUserExist.phone) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You can't transfer money from you to you"
        );
      }

      if (currentUserWallet.balance < data.amount) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Insufficient balance to complete the transaction."
        );
      }

      if (receiver.role === Role.AGENT) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Your can't transfer money from you to agent!"
        );
      }

      await Wallet.findByIdAndUpdate(
        isUserExist.wallet?._id,
        { $inc: { balance: -data.amount } },
        { session }
      );
      await Wallet.findByIdAndUpdate(
        receiver.wallet?._id,
        { $inc: { balance: data.amount } },
        { session }
      );

      newUpdatedTransaction = await Transaction.create(
        [
          {
            ...data,
            user: isUserExist._id,
            sendTo: receiver._id,
            status: "COMPLETED",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return newUpdatedTransaction[0];
    }

    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized for this action"
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateTransaction = async (
  id: string,
  payload: Partial<ITransaction>
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ifTransactionExist = await Transaction.findById(id).session(session);

    if (!ifTransactionExist) {
      throw new AppError(httpStatus.NOT_FOUND, "Transaction Not Found");
    }

    if (
      payload.status === TransactionStatus.REVERSED ||
      payload.status === TransactionStatus.PENDING
    ) {
      await Wallet.findByIdAndUpdate(
        ifTransactionExist.user,
        { $inc: { balance: ifTransactionExist.amount } },
        { session }
      );

      await Wallet.findByIdAndUpdate(
        ifTransactionExist.sendTo,
        { $inc: { balance: ifTransactionExist.amount } },
        { session }
      );
    }

    const newUpdatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    return newUpdatedTransaction;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const getAllTransactions = async () => {
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
