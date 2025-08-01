import { Types } from "mongoose";
import { Role, TransactionStatus, TransactionType } from "../../shared/types";

export interface ITransaction {
  _id?: Types.ObjectId;
  type: TransactionType;
  amount: number;
  fee?: Role;
  commission?: Types.ObjectId;
  status?: TransactionStatus;
  user: Types.ObjectId;
  sendTo: Types.ObjectId | string;
}
