"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//* import library
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
//* import functional
const register_1 = __importDefault(require("../function/register"));
const login_1 = __importDefault(require("../function/login"));
const gatewayFacebook_1 = __importDefault(require("../function/gatewayFacebook"));
const game_1 = __importDefault(require("../function/game"));
//* import middleware
const check_token_1 = __importDefault(require("../middleware/check-token"));
const router = express_1.default.Router();
router.post("/register", register_1.default);
router.post("/loginMember", login_1.default);
router.get("/facebookMember", passport_1.default.authenticate("facebook"));
router.get('/facebook/callback', passport_1.default.authenticate("facebook", { successRedirect: "/profile", session: true }));
router.get("/profile", gatewayFacebook_1.default);
router.post("/popularBoardgame", check_token_1.default, game_1.default);
exports.default = router;
//5583083095147918
