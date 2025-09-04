"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../../shared/types");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(types_1.Role),
        default: types_1.Role.USER,
    },
    phone: { type: String, unique: true, required: true },
    picture: { type: String },
    address: { type: String },
    isActive: {
        type: String,
        enum: Object.values(types_1.IsActive),
        default: types_1.IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: true },
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Transaction" }],
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
