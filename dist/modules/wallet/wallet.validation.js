"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletZodSchema = exports.createWalletZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const types_1 = require("../../shared/types");
exports.createWalletZodSchema = zod_1.default.object({
    balance: zod_1.default.number({ message: "Balance must be a number" }).nonnegative(),
    owner: zod_1.default.string({ message: "Owner must be string" }),
    status: zod_1.default.enum([types_1.IsActive.ACTIVE, types_1.IsActive.BLOCKED]).optional(),
    ownerType: zod_1.default.enum([types_1.Role.USER, types_1.Role.AGENT, types_1.Role.ADMIN]).optional(),
});
exports.updateWalletZodSchema = zod_1.default.object({
    balance: zod_1.default
        .number({ message: "Balance must be a number" })
        .nonnegative()
        .optional(),
    owner: zod_1.default.string({ message: "Owner must be string" }).optional(),
    status: zod_1.default.enum([types_1.IsActive.ACTIVE, types_1.IsActive.BLOCKED]).optional(),
    ownerType: zod_1.default.enum([types_1.Role.USER, types_1.Role.AGENT, types_1.Role.ADMIN]).optional(),
});
