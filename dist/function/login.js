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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
//* import model
const user_member_1 = __importDefault(require("../model/user-member"));
function Login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ "message": "please input username or password" });
        }
        else {
            try {
                const existUser = yield user_member_1.default.findOne({ username: { $eq: username } });
                if (!existUser) {
                    res.status(400).json({ "message": "don't exist user in database" });
                }
                else {
                    const hashPassword = existUser.password;
                    const checkPassword = yield bcrypt_1.default.compare(String(password), hashPassword);
                    if (!checkPassword) {
                        res.status(400).json({ "message": "password invalid" });
                    }
                    else {
                        const payload = {
                            "displayName": existUser.displayName,
                            "username": existUser.username
                        };
                        const secret = process.env.SECRET_TOKEN;
                        const accessToken = jwt.sign(payload, secret, {
                            "algorithm": "HS256",
                            expiresIn: "108000000ms"
                        });
                        const refreshToken = jwt.sign(payload, secret, {
                            "algorithm": "HS256",
                            expiresIn: "10h"
                        });
                        res.status(200).json({
                            "message": "login success",
                            "accessToken": accessToken,
                            "refreshToken": refreshToken
                        });
                    }
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ "message": "occurred error in server" });
            }
        }
    });
}
exports.default = Login;
