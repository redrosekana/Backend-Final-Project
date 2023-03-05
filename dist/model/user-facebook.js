"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import library
const mongoose_1 = require("mongoose");
const facebookMemberSchema = new mongoose_1.Schema({
    facebookId: { type: String },
    facebookName: { type: String },
    displayName: { type: String },
    lat: { type: String },
    lon: { type: String },
});
const facebook_members = (0, mongoose_1.model)("facebook-member", facebookMemberSchema);
exports.default = facebook_members;
