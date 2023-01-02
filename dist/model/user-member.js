"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//* import library
const mongoose_1 = require("mongoose");
const userMemberSchema = new mongoose_1.Schema({
    displayName: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    lat: { type: String },
    lon: { type: String },
});
const User_member = (0, mongoose_1.model)("user-member", userMemberSchema);
exports.default = User_member;
