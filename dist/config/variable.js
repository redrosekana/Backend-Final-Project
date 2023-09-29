"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.URL_POPULARBOARDGAME = exports.URL_FRONTEND = exports.PASSWORD_EMAIL = exports.SECRET_EMAIL = exports.SECRET_REFRESHTOKEN = exports.SECRET_ACCESSTOKEN = exports.SALT = exports.PORT = exports.URL_MONGODB = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const URL_MONGODB = process.env.URL_MONGODB;
exports.URL_MONGODB = URL_MONGODB;
const PORT = parseInt(process.env.PORT);
exports.PORT = PORT;
const SALT = parseInt(process.env.SALT);
exports.SALT = SALT;
const SECRET_ACCESSTOKEN = process.env.SECRET_ACCESSTOKEN;
exports.SECRET_ACCESSTOKEN = SECRET_ACCESSTOKEN;
const SECRET_REFRESHTOKEN = process.env.SECRET_REFRESHTOKEN;
exports.SECRET_REFRESHTOKEN = SECRET_REFRESHTOKEN;
const SECRET_EMAIL = process.env.SECRET_EMAIL;
exports.SECRET_EMAIL = SECRET_EMAIL;
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL;
exports.PASSWORD_EMAIL = PASSWORD_EMAIL;
const URL_FRONTEND = process.env.URL_FRONTEND;
exports.URL_FRONTEND = URL_FRONTEND;
const URL_POPULARBOARDGAME = process.env.URL_POPULARBOARDGAME;
exports.URL_POPULARBOARDGAME = URL_POPULARBOARDGAME;
