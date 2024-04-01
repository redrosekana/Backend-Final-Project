"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const auth_controller_1 = require("../function/auth/auth.controller");
// middleware
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
const checkRefreshToken_middleware_1 = __importDefault(require("../middleware/checkRefreshToken.middleware"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const auth_dto_1 = require("../function/auth/auth.dto");
const router = express_1.default.Router();
router.post(`/auth/register`, (0, validation_middleware_1.default)(auth_dto_1.RegisterDTO), auth_controller_1.register);
router.post(`/auth/login-password`, (0, validation_middleware_1.default)(auth_dto_1.LoginPasswordDTO), auth_controller_1.loginPassword);
router.post(`/auth/login-google`, (0, validation_middleware_1.default)(auth_dto_1.LoginGoogleDTO), auth_controller_1.loginGoogle);
router.get(`/auth/new-token`, checkRefreshToken_middleware_1.default, auth_controller_1.tokenRenew);
router.get(`/auth/detail-user`, checkAccessToken_middleware_1.default, auth_controller_1.detailUser);
router.post(`/auth/password`, checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(auth_dto_1.UpdatePasswordDTO), auth_controller_1.updatePassword);
exports.default = router;
