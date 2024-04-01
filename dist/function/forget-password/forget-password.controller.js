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
exports.resetPassword = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const fs = __importStar(require("fs"));
// model
const user_schema_1 = require("../../schema/user.schema");
// exception
const BadRequestException_1 = require("../../exeptions/BadRequestException");
// enviroment variable
const variable_1 = require("../../config/variable");
// utils
const validateEmail_1 = require("../../utils/validateEmail");
function sendEmail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email.trim();
        if (!(0, validateEmail_1.ValidateEmail)(email)) {
            next(new BadRequestException_1.BadRequestException("invalid format email"));
        }
        else {
            const user = yield user_schema_1.userModel.findOne({ email: { $eq: email } });
            if (!user) {
                next(new BadRequestException_1.BadRequestException("there is no email in the system"));
            }
            else {
                const transporter = nodemailer_1.default.createTransport({
                    service: "Gmail",
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "sukachathum.s@ku.th",
                        pass: variable_1.PASSWORD_EMAIL,
                    },
                    logger: true,
                });
                const payload = { email: email };
                const token = jwt.sign(payload, variable_1.SECRET_EMAIL, {
                    expiresIn: "300000ms",
                });
                const contentHTML = ejs_1.default.render(fs.readFileSync("./views/index.ejs", "utf8"), {
                    link: `<a class='btn' href='${variable_1.URL_FRONTEND}?token=${token}'>ยืนยันตัวตน</a>`,
                });
                const emailDetail = {
                    from: '"Boardgame recCommu" <sukachathum.s@ku.th>',
                    to: `'User' <${email}>`,
                    subject: "Reset Password",
                    date: new Date(),
                    html: contentHTML,
                };
                transporter.sendMail(emailDetail, (error) => {
                    if (error) {
                        next(error);
                    }
                    else {
                        res.status(200).json({
                            statusCode: 200,
                            message: "successfully send email",
                        });
                    }
                });
            }
        }
    });
}
exports.sendEmail = sendEmail;
function resetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.body.token.trim();
            const password_new = req.body.password_new.trim();
            const payload = jwt.verify(token, variable_1.SECRET_EMAIL);
            const salt = yield bcrypt_1.default.genSalt(variable_1.SALT);
            const passwordEncrypt = yield bcrypt_1.default.hash(password_new, salt);
            yield user_schema_1.userModel.findOneAndUpdate({
                email: { $eq: payload.email },
            }, {
                $set: {
                    password: passwordEncrypt,
                },
            });
            res.status(201).json({
                statusCode: 201,
                message: "successfully reset password",
            });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.resetPassword = resetPassword;
