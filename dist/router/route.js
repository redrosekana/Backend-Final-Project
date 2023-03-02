"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import library
const express_1 = __importDefault(require("express"));
// import functional
const register_1 = __importDefault(require("../function/register"));
const login_1 = __importDefault(require("../function/login"));
const game_1 = __importDefault(require("../function/game"));
const renewToken_1 = __importDefault(require("../function/renewToken"));
const manageFacebook_1 = __importDefault(require("../function/manageFacebook"));
const email_1 = __importDefault(require("../function/email"));
const verifyEmail_1 = __importDefault(require("../function/verifyEmail"));
const updatePassword_1 = __importDefault(require("../function/updatePassword"));
const recommendGuest_1 = __importDefault(require("../function/recommendGuest"));
const BoardGame_1 = __importDefault(require("../function/BoardGame"));
const popularBoardGame_1 = __importDefault(require("../function/popularBoardGame"));
// import middleware
const check_accessToken_1 = __importDefault(require("../middleware/check-accessToken"));
const check_user_1 = __importDefault(require("../middleware/check-user"));
const check_refreshToken_1 = __importDefault(require("../middleware/check-refreshToken"));
const router = express_1.default.Router();
// your welcome
router.get("/", (req, res) => {
    res.status(200).json({ message: "Hello Your Welcome to Api Boardgame Recommu" });
});
router.post("/register", register_1.default);
router.post("/login", login_1.default);
router.post("/email", email_1.default);
router.get("/email", verifyEmail_1.default);
router.post("/password", updatePassword_1.default);
router.get("/user", check_accessToken_1.default, check_user_1.default, game_1.default);
router.get("/renew", check_refreshToken_1.default, renewToken_1.default);
router.post("/facebook", manageFacebook_1.default);
router.get("/boardgames", BoardGame_1.default);
router.get("/guest", recommendGuest_1.default);
router.get("/popular", popularBoardGame_1.default);
exports.default = router;
