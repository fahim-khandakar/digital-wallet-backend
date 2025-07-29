import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { IsActive, Role } from "../../shared/types";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    transactions: { type: [Schema.Types.ObjectId], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
