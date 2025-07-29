import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";
import { IsActive, Role } from "../../shared/types";

const walletSchema = new Schema<IWallet>(
  {
    balance: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    ownerType: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
