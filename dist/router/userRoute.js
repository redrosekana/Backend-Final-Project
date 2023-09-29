"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../function/user/user.controller"));
const user_dto_1 = require("../function/user/user.dto");
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
class UserRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.path = "/users";
        this.userController = new user_controller_1.default();
        this.initialRoutes();
    }
    initialRoutes() {
        this.router.patch(`${this.path}`, checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(user_dto_1.UpdateUserDTO), this.userController.updateUser);
    }
}
exports.default = UserRoute;
