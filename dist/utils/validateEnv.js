"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        URL_MONGODB: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)(),
        SALT: (0, envalid_1.num)(),
        SECRET_ACCESSTOKEN: (0, envalid_1.str)(),
        SECRET_REFRESHTOKEN: (0, envalid_1.str)(),
        SECRET_EMAIL: (0, envalid_1.str)(),
        PASSWORD_EMAIL: (0, envalid_1.str)(),
        URL_FRONTEND: (0, envalid_1.str)(),
        URL_POPULARBOARDGAME: (0, envalid_1.str)(),
    });
};
exports.validateEnv = validateEnv;
