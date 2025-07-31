"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../../shared/types");
const walletSchema = new mongoose_1.Schema({
    balance: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(types_1.IsActive),
        default: types_1.IsActive.ACTIVE,
    },
    ownerType: {
        type: String,
        enum: Object.values(types_1.Role),
        default: types_1.Role.USER,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
