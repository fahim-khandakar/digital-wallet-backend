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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../error helpers/appError"));
const types_1 = require("../../shared/types");
const wallet_model_1 = require("./wallet.model");
const createWallet = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner } = payload, rest = __rest(payload, ["owner"]);
    const isOwnerHasWallet = yield wallet_model_1.Wallet.findOne({ owner });
    if (isOwnerHasWallet) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Already you have an account!");
    }
    const wallet = yield wallet_model_1.Wallet.create(Object.assign({ owner }, rest));
    return wallet;
});
const updateWallet = (id, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifWalletExist = yield wallet_model_1.Wallet.findById({ id });
    if (!ifWalletExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet Not Found");
    }
    if (payload.status) {
        if (decodedToken.role === types_1.Role.USER || decodedToken.role === types_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.ownerType) {
        if (decodedToken.role === types_1.Role.USER || decodedToken.role === types_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdatedWallet = yield wallet_model_1.Wallet.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedWallet;
});
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.find().populate("owner", "name email role");
    return {
        data: wallet,
    };
});
const getSingleWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findById(id);
    return {
        data: wallet,
    };
});
const getMyWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ owner: id });
    return {
        data: wallet,
    };
});
exports.WalletServices = {
    createWallet,
    getAllWallets,
    getSingleWallet,
    updateWallet,
    getMyWallet,
};
