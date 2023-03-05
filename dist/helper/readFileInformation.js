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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadFileItemBased = exports.ReadFileGamesCleaned = void 0;
// import library
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
// import helper
const convertStringToArray_1 = require("./convertStringToArray");
// import model
const boardgames_1 = __importDefault(require("../model/boardgames"));
const recommend_guest_1 = __importDefault(require("../model/recommend-guest"));
// สำหรับอ่านไฟล์ games-cleaned.csv
const ReadFileGamesCleaned = () => {
    fs.createReadStream(path.resolve(__dirname, "../../public/csv/games-cleaned.csv"))
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        data.category = (0, convertStringToArray_1.convertStringToArray)(data.category);
        data.mechanic = (0, convertStringToArray_1.convertStringToArray)(data.mechanic);
        data.designer = (0, convertStringToArray_1.convertStringToArray)(data.designer);
        data.artist = (0, convertStringToArray_1.convertStringToArray)(data.artist);
        data.publisher = (0, convertStringToArray_1.convertStringToArray)(data.publisher);
        yield boardgames_1.default.create(data);
    }));
};
exports.ReadFileGamesCleaned = ReadFileGamesCleaned;
// สำหรับอ่านไฟล์ item-based.csv
const ReadFileItemBased = () => {
    fs.createReadStream(path.resolve(__dirname, "../../public/csv/item-based.csv"))
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => __awaiter(void 0, void 0, void 0, function* () {
        data.recommend = (0, convertStringToArray_1.convertStringToArray)(data.recommend);
        yield recommend_guest_1.default.create(data);
    }));
};
exports.ReadFileItemBased = ReadFileItemBased;
