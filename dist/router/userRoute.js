"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const user_controller_1 = require("../function/user/user.controller");
// dto
const user_dto_1 = require("../function/user/user.dto");
// middleware
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
const router = express_1.default.Router();
router.patch("/users", checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(user_dto_1.UpdateUserDTO), user_controller_1.updateUser);
router.patch("/users/avatar", checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(user_dto_1.ChangeAvatarDTO), user_controller_1.changeAvatar);
router.patch("/users/scoring", checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(user_dto_1.RemoveScoreBoardgameDTO), user_controller_1.removeScoreBoardgame);
exports.default = router;
