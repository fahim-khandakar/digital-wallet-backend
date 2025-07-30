import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";
import { TransactionStatus, TransactionType } from "../../shared/types";

const transactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    commission: { type: Number, default: 0 },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    fee: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, required: true },
    sendTo: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
