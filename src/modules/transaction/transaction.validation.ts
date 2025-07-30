import { z } from "zod";
import { TransactionStatus, TransactionType } from "../../shared/types";

export const createTransactionZodSchema = z.object({
  amount: z.number().min(0, "Amount must be non-negative").nonnegative(),
  commission: z.number().min(0).optional(),
  fee: z.number().min(0).optional(),
  status: z.enum([...Object.values(TransactionStatus)]).optional(),
  type: z.enum([...Object.values(TransactionType)]),
  user: z.string().min(1, "User ID is required").optional(),
  sendTo: z.string().min(1, "User ID is required").optional(),
});

export const updateTransactionZodSchema = z.object({
  amount: z.number().min(0).optional(),
  commission: z.number().min(0).optional(),
  fee: z.number().min(0).optional(),
  status: z.enum([...Object.values(TransactionStatus)]).optional(),
  type: z.enum([...Object.values(TransactionType)]).optional(),
  user: z.string().min(1).optional(),
  sendTo: z.string().min(1, "User ID is required").optional(),
});
