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
const jwt = __importStar(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
//* import model
const user_facebook_1 = __importDefault(require("../model/user-facebook"));
function ManageFacebook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, accessTokenFacebook } = req.body;
        console.log(req.body);
        console.log(userId);
        console.log(accessTokenFacebook);
        const secret_accessToken = process.env.SECRET_ACCESSTOKEN;
        const secret_refreshToken = process.env.SECRET_REFRESHTOKEN;
        try {
            const result = yield axios_1.default.get(`https://graph.facebook.com/v4.0/${userId}?fields=id,name,email&access_token=${accessTokenFacebook}`);
            console.log(result.data);
            const facebookId = result.data.id;
            const facebookName = result.data.name;
            const existUser = yield user_facebook_1.default.findOne({ "facebookId": { $eq: facebookId } });
            console.log(existUser);
            if (!existUser) {
                const facebookUser = yield user_facebook_1.default.create({
                    "facebookId": facebookId,
                    "facebookName": facebookName
                });
                console.log("first add user");
            }
            const payload = {
                facebookName
            };
            const accessToken = jwt.sign(payload, secret_accessToken, {
                "algorithm": "HS256",
                expiresIn: "10000ms"
            });
            //"10000ms"
            //"1800000ms"
            const refreshToken = jwt.sign(payload, secret_refreshToken, {
                "algorithm": "HS256",
                expiresIn: "20000ms"
            });
            res.status(201).json({
                message: "success login facebook",
                accessToken,
                refreshToken
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                "message": "error in server"
            });
        }
    });
}
exports.default = ManageFacebook;
