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
const jwt = __importStar(require("jsonwebtoken"));
function RenewToken(req, res) {
    const secret_accessToken = process.env.SECRET_ACCESSTOKEN;
    const secret_refreshToken = process.env.SECRET_REFRESHTOKEN;
    const selectUser = req.payload;
    const payload = {};
    if (selectUser.username) {
        Object.assign(payload, {
            displayName: req.payload.displayName,
            username: req.payload.username
        });
    }
    else {
        Object.assign(payload, {
            facebookName: req.payload.facebookName,
        });
    }
    const accessToken = jwt.sign(payload, secret_accessToken, {
        algorithm: "HS256",
        expiresIn: "1800000ms"
    });
    //"10000ms"
    //"1800000ms"
    const refreshToken = jwt.sign(payload, secret_refreshToken, {
        algorithm: "HS256",
        expiresIn: "2700000ms"
    });
    //"20000ms"
    //"2700000ms"
    res.status(200).json({
        message: "renew token success",
        accessToken: accessToken,
        refreshToken: refreshToken
    });
}
exports.default = RenewToken;
