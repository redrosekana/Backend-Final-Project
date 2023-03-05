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
function UpdateUserMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { displayName, email } = req.body;
        if (!displayName && !email) {
            res.status(200).json({ message: "need least one field for update information" });
        }
        else {
            try {
                const information = req.user;
                const member = yield user_member_1.default.findOne({ username: { $eq: information.username } }).select("-_id -__v -password");
                yield user_member_1.default.findOneAndUpdate({ username: { $eq: member === null || member === void 0 ? void 0 : member.username } }, {
                    displayName: displayName,
                    email: email
                });
                res.status(200).json({ message: "update user member success" });
            }
            catch (err) {
                res.status(500).json({
                    "message": "occurred error in server"
                });
            }
        }
    });
}
exports.default = UpdateUserMember;
