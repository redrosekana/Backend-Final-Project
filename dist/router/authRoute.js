"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const auth_controller_1 = __importDefault(require("../function/auth/auth.controller"));
// middleware
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
const checkRefreshToken_middleware_1 = __importDefault(require("../middleware/checkRefreshToken.middleware"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const auth_dto_1 = require("../function/auth/auth.dto");
class AuthRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.path = "/auth";
        this.authController = new auth_controller_1.default();
        this.initialRoutes();
    }
    initialRoutes() {
        this.router.post(`${this.path}/register`, (0, validation_middleware_1.default)(auth_dto_1.RegisterDTO), this.authController.register);
        this.router.post(`${this.path}/login-password`, (0, validation_middleware_1.default)(auth_dto_1.LoginPasswordDTO), this.authController.loginPassword);
        this.router.get(`${this.path}/new-token`, checkRefreshToken_middleware_1.default, this.authController.tokenRenew);
        this.router.get(`${this.path}/detail-user`, checkAccessToken_middleware_1.default, this.authController.detailUser);
        this.router.post(`${this.path}/password`, checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(auth_dto_1.UpdatePasswordDTO), this.authController.updatePassword);
    }
}
exports.default = AuthRoute;
