"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("../../shared/types");
const transactionSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(types_1.TransactionStatus),
        default: types_1.TransactionStatus.PENDING,
    },
    commission: { type: Number, default: 0 },
    type: {
        type: String,
        enum: Object.values(types_1.TransactionType),
        required: true,
    },
    fee: { type: Number, default: 0 },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    sendTo: { type: mongoose_1.Schema.Types.ObjectId, required: true },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
