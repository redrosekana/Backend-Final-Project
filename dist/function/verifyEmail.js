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
function VerifyEmail(req, res) {
    const secret_waitemail = process.env.SECRET_WAITEMAIL;
    const { token } = req.query;
    try {
        const decode = jwt.verify(token, secret_waitemail);
        res.status(200).json({ message: "ok" });
    }
    catch (err) {
        if (err.message === "invalid signature") {
            res.status(400).json({
                message: "invalid signature"
            });
        }
        else if (err.message === "jwt expired") {
            res.status(400).json({
                message: "jwt expired token"
            });
        }
        else if (err.message === "jwt malformed") {
            res.status(400).json({
                message: "jwt malformed"
            });
        }
        else {
            res.status(500).json({
                message: "occurred error in server"
            });
        }
    }
}
exports.default = VerifyEmail;
