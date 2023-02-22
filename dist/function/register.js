"use strict";
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
// import model
const user_member_1 = __importDefault(require("../model/user-member"));
function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let { displayName, username, password, email } = req.body;
        if (!displayName || !username || !password || !email) {
            res.status(400).json({ message: "need additnal information" });
        }
        else {
            try {
                const repeatdisplayName = yield user_member_1.default.find({ displayName: displayName.trim() });
                const repeatUsername = yield user_member_1.default.find({ username: username.trim() });
                const repeatEmail = yield user_member_1.default.find({ email: email.trim() });
                if (repeatdisplayName.length > 0) {
                    res.status(400).json({ message: "displayName repeated" });
                }
                else if (repeatUsername.length > 0) {
                    res.status(400).json({ message: "username repeated" });
                }
                else if (repeatEmail.length > 0) {
                    res.status(400).json({ message: "email repeated" });
                }
                else {
                    const saltRounds = Number(process.env.SALTROUNDS);
                    const hashPassword = yield bcrypt_1.default.hash(String(password), saltRounds);
                    const user = {
                        "displayName": displayName.trim(),
                        "username": username.trim(),
                        "password": hashPassword.trim(),
                        "email": email.trim()
                    };
                    yield user_member_1.default.create(user);
                    res.status(200).json({ message: "register success" });
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: "occurred error in server" });
            }
        }
    });
}
exports.default = Register;
