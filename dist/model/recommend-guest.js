"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import library
const mongoose_1 = require("mongoose");
const recommendGuestSchema = new mongoose_1.Schema({
    game: { type: String },
    recommend: { type: [String] }
});
const Recommend_guest = (0, mongoose_1.model)("recommend-guest", recommendGuestSchema);
exports.default = Recommend_guest;
