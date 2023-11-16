"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partyModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const partySchema = new mongoose_1.Schema({
    name: { type: mongoose_1.default.Schema.Types.String, required: true },
    limit: {
        type: mongoose_1.default.Schema.Types.Number,
        required: true,
        min: 1,
    },
    category: { type: mongoose_1.default.Schema.Types.String, required: true },
    duration: { type: mongoose_1.default.Schema.Types.Number, required: true },
    place: { type: mongoose_1.default.Schema.Types.String, required: true },
    description: { type: mongoose_1.default.Schema.Types.String },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    member: { type: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "user" }] },
    countMember: { type: mongoose_1.default.Schema.Types.Number, required: true },
});
exports.partyModel = (0, mongoose_1.model)("party", partySchema);