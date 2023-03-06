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
const member_1 = __importDefault(require("../function/member"));
const renewToken_1 = __importDefault(require("../function/renewToken"));
const facebook_1 = __importDefault(require("../function/facebook"));
const sendEmail_1 = __importDefault(require("../function/sendEmail"));
const verifyEmail_1 = __importDefault(require("../function/verifyEmail"));
const resetPassword_1 = __importDefault(require("../function/resetPassword"));
const updatePassword_1 = __importDefault(require("../function/updatePassword"));
const updateUserMember_1 = __importDefault(require("../function/updateUserMember"));
const recommendGuest_1 = __importDefault(require("../function/recommendGuest"));
const boardGames_1 = __importDefault(require("../function/boardGames"));
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
router.post("/email", sendEmail_1.default);
router.get("/email", verifyEmail_1.default);
router.post("/password", resetPassword_1.default);
router.post("/auth/password", check_accessToken_1.default, check_user_1.default, updatePassword_1.default);
router.patch("/auth/member", check_accessToken_1.default, check_user_1.default, updateUserMember_1.default);
router.get("/member", check_accessToken_1.default, check_user_1.default, member_1.default);
router.get("/token", check_refreshToken_1.default, renewToken_1.default);
router.post("/facebook", facebook_1.default);
router.get("/guest", recommendGuest_1.default);
router.get("/popular", popularBoardGame_1.default);
router.get("/boardgames", boardGames_1.default);
exports.default = router;
