"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardgameRecommendModel = void 0;
const mongoose_1 = require("mongoose");
const BoardgameRecommendSchema = new mongoose_1.Schema({
    game: { type: String },
    recommend: { type: [String] },
});
exports.boardgameRecommendModel = (0, mongoose_1.model)("boardgameRecommend", BoardgameRecommendSchema);
