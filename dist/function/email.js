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
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const jwt = __importStar(require("jsonwebtoken"));
const fs = __importStar(require("fs"));
//* import model
const user_member_1 = __importDefault(require("../model/user-member"));
//* function check valid email
function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true);
    }
    else {
        return (false);
    }
}
function Email(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const password_email = process.env.PASSWORD_EMAIL;
        const secret_waitemail = process.env.SECRET_WAITEMAIL;
        const url_frontend = process.env.URL_FRONTEND;
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                "message": "require a user email"
            });
        }
        else if (!ValidateEmail(email)) {
            res.status(400).json({
                "message": "invalid email format"
            });
        }
        else {
            try {
                const result = yield user_member_1.default.findOne({ "email": { $eq: email } });
                if (!result) {
                    res.status(400).json({
                        "message": "don't exist a user email in the database"
                    });
                }
                else {
                    const transporter = nodemailer_1.default.createTransport({
                        service: "Gmail",
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "sukachathum.s@ku.th",
                            pass: password_email,
                        },
                        logger: true
                    });
                    const payload = { "email": email };
                    const token = jwt.sign(payload, secret_waitemail, {
                        algorithm: "HS256",
                        expiresIn: "300000ms"
                    });
                    const htmlString = ejs_1.default.render(fs.readFileSync('./views/index.ejs', 'utf8'), {
                        "link": `<a class='btn' href='${url_frontend}?token=${token}'>ยืนยันตัวตน</a>`
                    });
                    const info = {
                        from: '"Sukachathum" <sukachathum.s@ku.th>',
                        to: `'Customer' <${email}>`,
                        subject: "Reset Password",
                        date: new Date(),
                        html: htmlString,
                    };
                    transporter.sendMail(info, (err, result) => {
                        if (err) {
                            res.status(500).json({
                                "message": "occur error make to can't send email"
                            });
                        }
                        else {
                            console.log(result);
                            res.status(200).json({
                                "message": "send email success"
                            });
                        }
                    });
                }
            }
            catch (err) {
                res.status(500).json({
                    "message": "occur error in server"
                });
            }
        }
    });
}
exports.default = Email;
