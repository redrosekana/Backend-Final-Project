"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const score_controller_1 = require("../function/score/score.controller");
// dto
const score_dto_1 = require("../function/score/score.dto");
// middleware
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
const router = express_1.default.Router();
router.post("/score", checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(score_dto_1.ScoreBoardgameDTO), score_controller_1.scoreBoardgame);
exports.default = router;
