"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const forget_password_controller_1 = require("../function/forget-password/forget-password.controller");
// middleware
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const forget_password_dto_1 = require("../function/forget-password/forget-password.dto");
const router = express_1.default.Router();
router.post(`/email`, (0, validation_middleware_1.default)(forget_password_dto_1.SendEmailDTO), forget_password_controller_1.sendEmail);
router.post("/email-verify", (0, validation_middleware_1.default)(forget_password_dto_1.VerifyEmailDTO), forget_password_controller_1.resetPassword);
exports.default = router;
