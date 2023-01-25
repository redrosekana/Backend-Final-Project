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
//* import model
const user_member_1 = __importDefault(require("../model/user-member"));
const user_facebook_1 = __importDefault(require("../model/user-facebook"));
function checkUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectUser = req.payload;
        console.log("check-user = ", selectUser);
        try {
            if (selectUser.username) {
                const result = yield user_member_1.default.findOne({ "username": selectUser.username });
                console.log("usermember = ", result);
                req.proflie = {
                    "displayName": result === null || result === void 0 ? void 0 : result.displayName,
                    "username": result === null || result === void 0 ? void 0 : result.username,
                    "email": result === null || result === void 0 ? void 0 : result.email
                };
                next();
            }
            else {
                const result = yield user_facebook_1.default.findOne({ "facebookName": selectUser.facebookName });
                console.log("facebookmember = ", result);
                req.proflie = {
                    "displayName": ((result === null || result === void 0 ? void 0 : result.displayName) ? result === null || result === void 0 ? void 0 : result.displayName : "guest"),
                    "facebookId": result === null || result === void 0 ? void 0 : result.facebookId,
                    "facebookName": result === null || result === void 0 ? void 0 : result.facebookName
                };
                next();
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ "message": "occurred error in server" });
        }
    });
}
exports.default = checkUser;
