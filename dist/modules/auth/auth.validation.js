"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginZodSchema = zod_1.default.object({
    email: zod_1.default
        .string({ message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: zod_1.default
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
});
