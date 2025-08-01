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
exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const wallet_model_1 = require("../modules/wallet/wallet.model"); // make sure this path is correct
const types_1 = require("../shared/types"); // make sure IsActive is imported
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({
            email: env_1.envVars.ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create Admin...", env_1.envVars.ADMIN_EMAIL);
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const payload = {
            name: "Fahim Khandakar",
            role: types_1.Role.ADMIN,
            email: env_1.envVars.ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            phone: "01903994195",
        };
        const superAdmin = yield user_model_1.User.create(payload);
        const wallet = yield wallet_model_1.Wallet.create({
            balance: 50,
            owner: superAdmin._id,
            ownerType: superAdmin.role,
            status: types_1.IsActive.ACTIVE,
        });
        superAdmin.wallet = wallet._id;
        yield superAdmin.save();
        console.log("Super Admin Created Successfully with Wallet! \n");
        console.log(superAdmin);
    }
    catch (error) {
        console.log("Failed to seed admin:", error);
    }
});
exports.seedAdmin = seedAdmin;
