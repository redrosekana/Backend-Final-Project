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
exports.updatePassword = exports.detailUser = exports.tokenRenew = exports.loginGoogle = exports.loginPassword = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
// model
const user_schema_1 = require("../../schema/user.schema");
const score_schema_1 = require("../../schema/score.schema");
// exception
const BadRequestException_1 = require("../../exeptions/BadRequestException");
const UnAuthorizationException_1 = require("../../exeptions/UnAuthorizationException");
// enviroment variable
const variable_1 = require("../../config/variable");
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const displayName = req.body.displayName.trim();
            const username = req.body.username.trim();
            const password = req.body.password.trim();
            const email = req.body.email.trim();
            if (yield user_schema_1.userModel.findOne({ displayName: { $eq: displayName } })) {
                next(new BadRequestException_1.BadRequestException("displayName is repeated"));
            }
            else if (yield user_schema_1.userModel.findOne({ username: { $eq: username } })) {
                next(new BadRequestException_1.BadRequestException("username is repeated"));
            }
            else if (yield user_schema_1.userModel.findOne({ email: { $eq: email } })) {
                next(new BadRequestException_1.BadRequestException("email is repeated"));
            }
            else {
                const salt = yield bcrypt_1.default.genSalt(variable_1.SALT);
                const passwordEncrypt = yield bcrypt_1.default.hash(password, salt);
                const scoring = yield score_schema_1.scoreModel.create({
                    scoreEntries: [],
                });
                yield user_schema_1.userModel.create({
                    displayName: displayName,
                    username: username,
                    password: passwordEncrypt,
                    urlAvatar: `${variable_1.URL_CLOUDSTORAGE}/avatar-maker/avatar-${1 + Math.floor(Math.random() * 60)}.svg`,
                    email: email,
                    provider: "password",
                    scoring: scoring.id,
                });
                res.status(201).json({
                    statusCode: 201,
                    message: "successfully created user",
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.register = register;
function loginPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.body.username.trim();
            const password = req.body.password.trim();
            const user = yield user_schema_1.userModel.findOne({
                username: { $eq: username },
                provider: { $eq: "password" },
            });
            if (!user) {
                next(new UnAuthorizationException_1.UnAuthorizationException("there is no username in the system"));
            }
            else {
                const passwordCheck = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordCheck) {
                    next(new UnAuthorizationException_1.UnAuthorizationException("invalid password"));
                }
                else {
                    const payload = {
                        displayName: user.displayName,
                        email: user.email,
                        provider: user.provider,
                    };
                    const accessToken = jwt.sign(payload, variable_1.SECRET_ACCESSTOKEN, {
                        expiresIn: "900000ms",
                    });
                    const refreshToken = jwt.sign(payload, variable_1.SECRET_REFRESHTOKEN, {
                        expiresIn: "3600000ms",
                    });
                    res.status(200).json({
                        statusCode: 200,
                        message: "successfully login user",
                        accessToken,
                        refreshToken,
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.loginPassword = loginPassword;
function loginGoogle(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const google_token = req.body.google_token.trim();
            const client = new google_auth_library_1.OAuth2Client();
            const result = yield client.verifyIdToken({
                idToken: google_token,
            });
            const googlePayload = result.getPayload();
            const user = yield user_schema_1.userModel.findOne({
                email: googlePayload === null || googlePayload === void 0 ? void 0 : googlePayload.email,
                provider: "google",
            });
            if (!user) {
                const scoring = yield score_schema_1.scoreModel.create({
                    scoreEntries: [],
                });
                yield user_schema_1.userModel.create({
                    displayName: "guest",
                    email: googlePayload === null || googlePayload === void 0 ? void 0 : googlePayload.email,
                    urlAvatar: `${variable_1.URL_CLOUDSTORAGE}/avatar-maker/avatar-${1 + Math.floor(Math.random() * 60)}.svg`,
                    provider: "google",
                    scoring: scoring.id,
                });
            }
            const payload = {
                displayName: (user === null || user === void 0 ? void 0 : user.displayName) || "guest",
                email: (user === null || user === void 0 ? void 0 : user.email) || (googlePayload === null || googlePayload === void 0 ? void 0 : googlePayload.email),
                provider: "google",
            };
            const accessToken = jwt.sign(payload, variable_1.SECRET_ACCESSTOKEN, {
                expiresIn: "900000ms",
            });
            const refreshToken = jwt.sign(payload, variable_1.SECRET_REFRESHTOKEN, {
                expiresIn: "3600000ms",
            });
            res.status(200).json({
                statusCode: 200,
                message: "successfully login user",
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.loginGoogle = loginGoogle;
function tokenRenew(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = req.payload;
            const user = yield user_schema_1.userModel.findOne({
                email: { $eq: payload.email },
                provider: { $eq: payload.provider },
            });
            if (!user) {
                next(new UnAuthorizationException_1.UnAuthorizationException("access denied for user"));
            }
            else {
                const payload = {
                    displayName: user.displayName,
                    email: user.email,
                    provider: user.provider,
                };
                const accessToken = jwt.sign(payload, variable_1.SECRET_ACCESSTOKEN, {
                    expiresIn: "900000ms",
                });
                const refreshToken = jwt.sign(payload, variable_1.SECRET_REFRESHTOKEN, {
                    expiresIn: "3600000ms",
                });
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully renew token",
                    accessToken,
                    refreshToken,
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.tokenRenew = tokenRenew;
function detailUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = req.payload;
            const user = yield user_schema_1.userModel
                .findOne({
                email: { $eq: payload.email },
                provider: { $eq: payload.provider },
            })
                .populate({
                path: "ownerParty",
                select: {
                    __v: 0,
                },
                populate: [
                    {
                        path: "owner",
                        select: {
                            displayName: 1,
                            urlAvatar: 1,
                            email: 1,
                        },
                    },
                    {
                        path: "member",
                        select: {
                            displayName: 1,
                            urlAvatar: 1,
                            email: 1,
                        },
                    },
                ],
            })
                .populate({
                path: "memberParty",
                select: {
                    __v: 0,
                },
                populate: [
                    {
                        path: "owner",
                        select: {
                            displayName: 1,
                            urlAvatar: 1,
                            email: 1,
                        },
                    },
                    {
                        path: "member",
                        select: {
                            displayName: 1,
                            urlAvatar: 1,
                            email: 1,
                        },
                    },
                ],
            })
                .populate({
                path: "scoring",
                select: {
                    __v: 0,
                    _id: 0,
                },
            })
                .select("-password -__v");
            res.status(200).json({
                statusCode: 200,
                message: "user is authenticated",
                data: user,
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.detailUser = detailUser;
function updatePassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = req.payload;
            const password_old = req.body.password_old.trim();
            const password_new = req.body.password_new.trim();
            const user = yield user_schema_1.userModel.findOne({
                email: { $eq: payload.email },
                provider: { $eq: "password" },
            });
            const checkPassword = yield bcrypt_1.default.compare(password_old, user === null || user === void 0 ? void 0 : user.password);
            if (!checkPassword) {
                next(new UnAuthorizationException_1.UnAuthorizationException("invalid old password"));
            }
            else {
                const salt = yield bcrypt_1.default.genSalt(variable_1.SALT);
                const passwordNewEncrypt = yield bcrypt_1.default.hash(password_new, salt);
                yield user_schema_1.userModel.findOneAndUpdate({ email: req.payload.email, provider: { $eq: payload.provider } }, {
                    $set: {
                        password: passwordNewEncrypt,
                    },
                });
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully updated password",
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.updatePassword = updatePassword;
