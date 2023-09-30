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
Object.defineProperty(exports, "__esModule", { value: true });
// model
const user_schema_1 = require("../../schema/user.schema");
// exception
const BadRequestException_1 = require("../../exeptions/BadRequestException");
class UserController {
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.payload;
                if (payload.provider === "password") {
                    const displayName = req.body.displayName.trim();
                    const username = req.body.username.trim();
                    const user = yield user_schema_1.userModel.findOne({
                        email: { $eq: payload.email },
                        provider: { $eq: "password" },
                    });
                    if ((yield user_schema_1.userModel.findOne({
                        username: { $eq: username },
                        provider: { $eq: payload.provider },
                    })) &&
                        (user === null || user === void 0 ? void 0 : user.username) !== username) {
                        next(new BadRequestException_1.BadRequestException("username is repeated"));
                    }
                    else {
                        yield user_schema_1.userModel.findOneAndUpdate({
                            email: { $eq: payload.email },
                            provider: { $eq: "password" },
                        }, {
                            $set: {
                                displayName,
                                username,
                            },
                        });
                        res.status(202).json({
                            statusCode: 202,
                            message: "successfully update user",
                        });
                    }
                }
                else {
                    const displayName = req.body.displayName.trim();
                    yield user_schema_1.userModel.findOneAndUpdate({
                        email: { $eq: payload.email },
                        provider: { $eq: payload.provider },
                    }, {
                        $set: {
                            displayName,
                        },
                    });
                    res.status(202).json({
                        statusCode: 202,
                        message: "successfully update user",
                    });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = UserController;
