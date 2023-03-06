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
const user_member_1 = __importDefault(require("../model/user-member"));
const user_facebook_1 = __importDefault(require("../model/user-facebook"));
function UpdateUserMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { displayNameUser, email, displayNameFacebook } = req.body;
        const information = req.user;
        try {
            if (information.username) {
                if (!displayNameUser && !email) {
                    res.status(200).json({ message: "need least one field for update information" });
                }
                else {
                    const repeatDisplayNameUser = yield user_member_1.default.findOne({ displayName: { $eq: displayNameUser } });
                    const repeatEmail = yield user_member_1.default.findOne({ email: { $eq: email } });
                    if (repeatDisplayNameUser) {
                        res.status(400).json({ message: "displayName repeated" });
                    }
                    else if (repeatEmail) {
                        res.status(400).json({ message: "email repeated" });
                    }
                    else {
                        const member = yield user_member_1.default.findOne({ username: { $eq: information.username } }).select("-_id -__v -password");
                        yield user_member_1.default.findOneAndUpdate({ username: { $eq: member === null || member === void 0 ? void 0 : member.username } }, {
                            displayName: displayNameUser,
                            email: email
                        });
                        res.status(200).json({ message: "update user member success" });
                    }
                }
            }
            else {
                if (!displayNameFacebook) {
                    res.status(200).json({ message: "need least one field for update information" });
                }
                else {
                    const repeatDisplayNameFacebook = yield user_facebook_1.default.findOne({ displayName: { $eq: displayNameFacebook } });
                    if (repeatDisplayNameFacebook) {
                        res.status(400).json({ message: "displayName repeated" });
                    }
                    else {
                        const member = yield user_facebook_1.default.findOne({ facebookId: { $eq: information.facebookId } }).select("-_id -__v -password");
                        yield user_facebook_1.default.findOneAndUpdate({ facebookId: { $eq: member === null || member === void 0 ? void 0 : member.facebookId } }, {
                            displayName: displayNameFacebook,
                        });
                        res.status(200).json({ message: "update facebook member success" });
                    }
                }
            }
        }
        catch (err) {
            res.status(500).json({
                "message": "occurred error in server"
            });
        }
    });
}
exports.default = UpdateUserMember;
