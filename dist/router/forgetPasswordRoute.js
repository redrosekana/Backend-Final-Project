"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const forget_password_controller_1 = __importDefault(require("../function/forget-password/forget-password.controller"));
// middleware
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const forget_password_dto_1 = require("../function/forget-password/forget-password.dto");
class ForgetPasswordRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.forgetPasswordController = new forget_password_controller_1.default();
        this.initialRoutes();
    }
    initialRoutes() {
        this.router.post(`/email`, (0, validation_middleware_1.default)(forget_password_dto_1.SendEmailDTO), this.forgetPasswordController.sendEmail);
        this.router.post("/email-verify", (0, validation_middleware_1.default)(forget_password_dto_1.VerifyEmailDTO), this.forgetPasswordController.resetPassword);
    }
}
exports.default = ForgetPasswordRoute;
