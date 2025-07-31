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
exports.UserServices = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const user_model_1 = require("./user.model");
const appError_1 = __importDefault(require("../../error helpers/appError"));
const types_1 = require("../../shared/types");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const session = yield mongoose_1.default.startSession();
    let newUser;
    try {
        session.startTransaction();
        newUser = yield user_model_1.User.create([
            Object.assign({ email, password: hashedPassword }, rest),
        ], { session });
        const createdUser = newUser[0];
        const newWallet = yield wallet_model_1.Wallet.create([
            {
                balance: 50,
                owner: createdUser._id,
                ownerType: createdUser.role,
                status: types_1.IsActive.ACTIVE,
            },
        ], { session });
        const createdWallet = newWallet[0];
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(createdUser._id, { wallet: createdWallet._id }, { session, new: true });
        yield session.commitTransaction();
        session.endSession();
        return updatedUser;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.createUser = createUser;
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.role) {
        if (decodedToken.role === types_1.Role.USER || decodedToken.role === types_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isVerified) {
        if (decodedToken.role === types_1.Role.USER || decodedToken.role === types_1.Role.AGENT) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find().select("-password");
    return {
        data: user,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
});
exports.UserServices = {
    createUser: exports.createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
};
