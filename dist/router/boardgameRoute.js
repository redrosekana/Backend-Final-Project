"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const boardgame_controller_1 = require("../function/boardgame/boardgame.controller");
// middleware
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const boardgame_dto_1 = require("../function/boardgame/boardgame.dto");
// middleware
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
const router = express_1.default.Router();
router.get(`/boardgames`, boardgame_controller_1.boardgames);
router.get(`/boardgames/popular`, boardgame_controller_1.boardgamesPopular);
router.post(`/boardgames/guest`, (0, validation_middleware_1.default)(boardgame_dto_1.BoardgameRecommendGuessDTO), boardgame_controller_1.boardgameRecommendGuestUser);
router.post("/boardgames/recommend", (0, validation_middleware_1.default)(boardgame_dto_1.BoardgameRecommendAuthDTO), checkAccessToken_middleware_1.default, boardgame_controller_1.boardgameRecommendAuth);
exports.default = router;
