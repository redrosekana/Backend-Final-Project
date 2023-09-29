"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    displayName: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    lat: { type: String },
    lon: { type: String },
    provider: {
        type: String,
        required: true,
        enum: ["password", "google", "github"],
    },
});
exports.userModel = (0, mongoose_1.model)("user", userSchema);
