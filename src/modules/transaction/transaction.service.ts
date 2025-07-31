import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error helpers/appError";
import { Role, TransactionType } from "../../shared/types";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { IWallet } from "../wallet/wallet.interface";

const createTransaction = async (
  payload: Partial<ITransaction>,
  user: string
) => {
  const data = payload;
  const isUserExist = await User.findById(user)
    .populate("wallet")
    .select("role phone");

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  const currentUserWallet = isUserExist.wallet as unknown as IWallet;

  let newUpdatedTransaction = null;

  if (data.type === TransactionType.TOP_UP) {
    await Wallet.findByIdAndUpdate(
      isUserExist.wallet?._id,
      { $inc: { balance: data.amount } },
      { new: true }
    );

    newUpdatedTransaction = await Transaction.create({
      ...data,
      user: isUserExist._id,
      sendTo: isUserExist._id,
      status: "COMPLETED",
    });

    return newUpdatedTransaction;
  }

  if (
    data.type === TransactionType.CASH_IN &&
    data.amount &&
    (isUserExist.role === Role.ADMIN || isUserExist.role === Role.AGENT)
  ) {
    const receiver = await User.findOne({ phone: data.sendTo }).populate(
      "wallet"
    );
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

    await Wallet.findByIdAndUpdate(isUserExist.wallet?._id, {
      $inc: { balance: -data.amount },
    });

    await Wallet.findByIdAndUpdate(receiver.wallet?._id, {
      $inc: { balance: data.amount },
    });

    newUpdatedTransaction = await Transaction.create({
      ...data,
      user: isUserExist._id,
      sendTo: receiver._id,
      status: "COMPLETED",
    });

    return newUpdatedTransaction;
  }

  if (
    data.type === TransactionType.CASH_OUT &&
    data.amount &&
    (isUserExist.role === Role.ADMIN || isUserExist.role === Role.AGENT)
  ) {
    const receiver = await User.findOne({ phone: data.sendTo }).populate(
      "wallet"
    );
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

    await Wallet.findByIdAndUpdate(isUserExist.wallet?._id, {
      $inc: { balance: -data.amount },
    });
    await Wallet.findByIdAndUpdate(receiver.wallet?._id, {
      $inc: { balance: data.amount },
    });

    newUpdatedTransaction = await Transaction.create({
      ...data,
      user: isUserExist._id,
      sendTo: receiver._id,
      status: "COMPLETED",
    });

    return newUpdatedTransaction;
  }

  if (data.type === TransactionType.TRANSFER && data.sendTo && data.amount) {
    const receiver = await User.findOne({ phone: data.sendTo })
      .populate("wallet")
      .select("phone");
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
    await Wallet.findByIdAndUpdate(isUserExist.wallet?._id, {
      $inc: { balance: -data.amount },
    });
    await Wallet.findByIdAndUpdate(receiver.wallet?._id, {
      $inc: { balance: data.amount },
    });

    newUpdatedTransaction = await Transaction.create({
      ...data,
      user: isUserExist._id,
      sendTo: receiver._id,
      status: "COMPLETED",
    });

    return newUpdatedTransaction;
  }

  throw new AppError(
    httpStatus.FORBIDDEN,
    "You are not authorized for this action"
  );
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

export const getAllTransactions = async (verifiedToken: JwtPayload) => {
  const userRole = verifiedToken.role;
  const userId = verifiedToken._id;

  let transaction;

  if (userRole === Role.ADMIN) {
    transaction = await Transaction.find();
  } else {
    transaction = await Transaction.find({ user: userId });
  }

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
