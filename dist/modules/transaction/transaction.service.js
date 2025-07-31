"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = exports.getAllTransactions = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../error helpers/appError"));
const types_1 = require("../../shared/types");
const transaction_model_1 = require("./transaction.model");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const wallet_interface_1 = require("../wallet/wallet.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const createTransaction = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const data = payload;
        const isUserExist = yield user_model_1.User.findById(user)
            .populate("wallet")
            .select("role phone")
            .session(session);
        const receiver = yield user_model_1.User.findOne({ phone: data.sendTo })
            .populate("wallet")
            .session(session);
        const receiverWallet = receiver === null || receiver === void 0 ? void 0 : receiver.wallet;
        const userWallet = receiver === null || receiver === void 0 ? void 0 : receiver.wallet;
        if (!receiver) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver number does not exist");
        }
        if (receiverWallet.status === wallet_interface_1.IsWalletActive.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet is blocked");
        }
        if (userWallet.status === wallet_interface_1.IsWalletActive.BLOCKED) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your wallet is blocked");
        }
        if (!isUserExist) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        const currentUserWallet = isUserExist.wallet;
        let newUpdatedTransaction = null;
        if (data.type === types_1.TransactionType.TOP_UP) {
            yield wallet_model_1.Wallet.findByIdAndUpdate((_a = isUserExist.wallet) === null || _a === void 0 ? void 0 : _a._id, { $inc: { balance: data.amount } }, { new: true, session });
            newUpdatedTransaction = yield transaction_model_1.Transaction.create([
                Object.assign(Object.assign({}, data), { user: isUserExist._id, sendTo: isUserExist._id, status: "COMPLETED" }),
            ], { session });
            yield session.commitTransaction();
            session.endSession();
            return newUpdatedTransaction[0];
        }
        if (data.type === types_1.TransactionType.CASH_IN &&
            data.amount &&
            (isUserExist.role === types_1.Role.ADMIN || isUserExist.role === types_1.Role.AGENT)) {
            if (currentUserWallet.balance < data.amount) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance to complete the transaction.");
            }
            if (isUserExist.phone === String(data.sendTo)) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can't transaction in same account");
            }
            yield wallet_model_1.Wallet.findByIdAndUpdate((_b = isUserExist.wallet) === null || _b === void 0 ? void 0 : _b._id, { $inc: { balance: -data.amount } }, { session });
            yield wallet_model_1.Wallet.findByIdAndUpdate((_c = receiver.wallet) === null || _c === void 0 ? void 0 : _c._id, { $inc: { balance: data.amount } }, { session });
            newUpdatedTransaction = yield transaction_model_1.Transaction.create([
                Object.assign(Object.assign({}, data), { user: isUserExist._id, sendTo: receiver._id, status: "COMPLETED" }),
            ], { session });
            yield session.commitTransaction();
            session.endSession();
            return newUpdatedTransaction[0];
        }
        if (data.type === types_1.TransactionType.CASH_OUT &&
            data.amount &&
            (isUserExist.role === types_1.Role.ADMIN || isUserExist.role === types_1.Role.AGENT)) {
            if (currentUserWallet.balance < data.amount) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance to complete the transaction.");
            }
            if (isUserExist.phone === String(data.sendTo)) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can't transaction in same account");
            }
            if (receiver.role !== types_1.Role.AGENT) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your receiver is not an agent!");
            }
            yield wallet_model_1.Wallet.findByIdAndUpdate((_d = isUserExist.wallet) === null || _d === void 0 ? void 0 : _d._id, { $inc: { balance: -data.amount } }, { session });
            yield wallet_model_1.Wallet.findByIdAndUpdate((_e = receiver.wallet) === null || _e === void 0 ? void 0 : _e._id, { $inc: { balance: data.amount } }, { session });
            newUpdatedTransaction = yield transaction_model_1.Transaction.create([
                Object.assign(Object.assign({}, data), { user: isUserExist._id, sendTo: receiver._id, status: "COMPLETED" }),
            ], { session });
            yield session.commitTransaction();
            session.endSession();
            return newUpdatedTransaction[0];
        }
        if (data.type === types_1.TransactionType.TRANSFER && data.sendTo && data.amount) {
            if (receiver.phone === isUserExist.phone) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can't transfer money from you to you");
            }
            if (currentUserWallet.balance < data.amount) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient balance to complete the transaction.");
            }
            if (receiver.role === types_1.Role.AGENT) {
                throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your can't transfer money from you to agent!");
            }
            yield wallet_model_1.Wallet.findByIdAndUpdate((_f = isUserExist.wallet) === null || _f === void 0 ? void 0 : _f._id, { $inc: { balance: -data.amount } }, { session });
            yield wallet_model_1.Wallet.findByIdAndUpdate((_g = receiver.wallet) === null || _g === void 0 ? void 0 : _g._id, { $inc: { balance: data.amount } }, { session });
            newUpdatedTransaction = yield transaction_model_1.Transaction.create([
                Object.assign(Object.assign({}, data), { user: isUserExist._id, sendTo: receiver._id, status: "COMPLETED" }),
            ], { session });
            yield session.commitTransaction();
            session.endSession();
            return newUpdatedTransaction[0];
        }
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized for this action");
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateTransaction = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const ifTransactionExist = yield transaction_model_1.Transaction.findById(id).session(session);
        if (!ifTransactionExist) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Transaction Not Found");
        }
        if (payload.status === types_1.TransactionStatus.REVERSED ||
            payload.status === types_1.TransactionStatus.PENDING) {
            yield wallet_model_1.Wallet.findByIdAndUpdate(ifTransactionExist.user, { $inc: { balance: ifTransactionExist.amount } }, { session });
            yield wallet_model_1.Wallet.findByIdAndUpdate(ifTransactionExist.sendTo, { $inc: { balance: ifTransactionExist.amount } }, { session });
        }
        const newUpdatedTransaction = yield transaction_model_1.Transaction.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return newUpdatedTransaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.find();
    return {
        data: transaction,
    };
});
exports.getAllTransactions = getAllTransactions;
const getSingleTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.findById(id);
    return {
        data: transaction,
    };
});
const getMyTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.find({
        user: id,
    });
    return {
        data: transaction,
    };
});
exports.TransactionServices = {
    createTransaction,
    getAllTransactions: exports.getAllTransactions,
    getSingleTransaction,
    updateTransaction,
    getMyTransaction,
};
