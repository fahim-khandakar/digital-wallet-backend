"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionZodSchema = exports.createTransactionZodSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../../shared/types");
exports.createTransactionZodSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0, "Amount must be non-negative").nonnegative(),
    commission: zod_1.z.number().min(0).optional(),
    fee: zod_1.z.number().min(0).optional(),
    status: zod_1.z.enum([...Object.values(types_1.TransactionStatus)]).optional(),
    type: zod_1.z.enum([...Object.values(types_1.TransactionType)]),
    user: zod_1.z.string().optional(),
    sendTo: zod_1.z.string().optional(),
});
exports.updateTransactionZodSchema = zod_1.z.object({
    amount: zod_1.z.number().min(0).optional(),
    commission: zod_1.z.number().min(0).optional(),
    fee: zod_1.z.number().min(0).optional(),
    status: zod_1.z.enum([...Object.values(types_1.TransactionStatus)]).optional(),
    type: zod_1.z.enum([...Object.values(types_1.TransactionType)]).optional(),
    user: zod_1.z.string().optional(),
    sendTo: zod_1.z.string().optional(),
});
