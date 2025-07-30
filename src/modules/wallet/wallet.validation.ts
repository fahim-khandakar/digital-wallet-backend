import z from "zod";
import { IsActive, Role } from "../../shared/types";

export const createWalletZodSchema = z.object({
  balance: z.number({ message: "Balance must be a number" }).nonnegative(),
  owner: z.string({ message: "Owner must be string" }),
  status: z.enum([IsActive.ACTIVE, IsActive.BLOCKED]).optional(),
  ownerType: z.enum([Role.USER, Role.AGENT, Role.ADMIN]).optional(),
});

export const updateWalletZodSchema = z.object({
  balance: z
    .number({ message: "Balance must be a number" })
    .nonnegative()
    .optional(),
  owner: z.string({ message: "Owner must be string" }).optional(),
  status: z.enum([IsActive.ACTIVE, IsActive.BLOCKED]).optional(),
  ownerType: z.enum([Role.USER, Role.AGENT, Role.ADMIN]).optional(),
});
