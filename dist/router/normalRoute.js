"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.status(200).json({
        api_name: "boardgame recommu",
        api_version: "1.0.0",
        api_released: "2023-09-24 13:30:35",
        api_documentation: null,
        api_status: "active",
    });
});
exports.default = router;
