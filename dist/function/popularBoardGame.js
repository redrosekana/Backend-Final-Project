"use strict";
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
const axios_1 = __importDefault(require("axios"));
const xml_js_1 = __importDefault(require("xml-js"));
function PopularBoardGame(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultPopularBoardGame = [];
        const url = process.env.API_POPULARBOARDGAME;
        try {
            const result = yield axios_1.default.get(url);
            const jsonObject = xml_js_1.default.xml2js(result.data);
            for (let i = 0; i < jsonObject.elements[0].elements.length; i++) {
                // เอาแค่ 10 อันดับ
                if (i === 15)
                    break;
                const body = {
                    name: jsonObject.elements[0].elements[i].elements[1].attributes.value,
                    picture: jsonObject.elements[0].elements[i].elements[0].attributes.value,
                    year: jsonObject.elements[0].elements[i].elements[2].attributes.value
                };
                resultPopularBoardGame.push(body);
            }
            res.status(200).json(resultPopularBoardGame);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ meesage: "occurred error in server" });
        }
    });
}
exports.default = PopularBoardGame;
