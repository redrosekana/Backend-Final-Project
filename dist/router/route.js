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
const renewToken_1 = __importDefault(require("../function/renewToken"));
//* import middleware
const check_accessToken_1 = __importDefault(require("../middleware/check-accessToken"));
const check_user_1 = __importDefault(require("../middleware/check-user"));
const check_refreshToken_1 = __importDefault(require("../middleware/check-refreshToken"));
const router = express_1.default.Router();
router.post("/register", register_1.default);
router.post("/loginMember", login_1.default);
router.get("/facebookMember", passport_1.default.authenticate("facebook"));
router.get('/facebook/callback', passport_1.default.authenticate("facebook", { successRedirect: "/gateway", session: true }));
router.get("/gateway", gatewayFacebook_1.default);
router.get("/user", check_accessToken_1.default, check_user_1.default, game_1.default);
router.get("/renewUser", check_refreshToken_1.default, renewToken_1.default);
exports.default = router;
//5583083095147918
//5583336948455866
//5583336948455866
