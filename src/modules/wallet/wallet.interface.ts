import { Types } from "mongoose";
import { Role } from "../../shared/types";

export enum IsWalletActive {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IWallet {
  _id?: Types.ObjectId;
  balance: string;
  status?: IsWalletActive;
  ownerType?: Role;
  owner: Types.ObjectId;
}
