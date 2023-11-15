"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const boardgame_controller_1 = __importDefault(require("../function/boardgame/boardgame.controller"));
// middleware
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const boardgame_dto_1 = require("../function/boardgame/boardgame.dto");
class BoardgameRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.path = "/boardgames";
        this.boardgameController = new boardgame_controller_1.default();
        this.initialRoutes();
    }
    initialRoutes() {
        this.router.get(`${this.path}`, this.boardgameController.boardgames);
        this.router.get(`${this.path}/popular`, this.boardgameController.boardgamesPopular);
        this.router.post(`${this.path}/guest`, (0, validation_middleware_1.default)(boardgame_dto_1.BoardgameRecommendGuessDTO), this.boardgameController.boardgameRecommendGuestUser);
    }
}
exports.default = BoardgameRoute;
