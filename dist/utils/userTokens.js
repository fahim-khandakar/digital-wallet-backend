"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTokens = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const createUserTokens = (user) => {
    const jwtPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserTokens = createUserTokens;
