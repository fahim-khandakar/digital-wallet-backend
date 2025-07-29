import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../error helpers/appError";
import { Role } from "../../shared/types";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const createTransaction = async (payload: Partial<ITransaction>) => {
  const data = payload;

  const wallet = await Transaction.create({ data });

  return wallet;
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
