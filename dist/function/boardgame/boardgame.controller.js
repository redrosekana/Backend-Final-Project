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
// model
const boardgameRecommend_schema_1 = require("../../schema/boardgameRecommend.schema");
const boardgame_schema_1 = require("../../schema/boardgame.schema");
// exception
const BadRequestException_1 = require("../../exeptions/BadRequestException");
// enviroment variable
const variable_1 = require("../../config/variable");
class BoardgameController {
    boardgames(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const boardgames = yield boardgameRecommend_schema_1.boardgameRecommendModel.find({});
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully findAll boardgames",
                    data: boardgames,
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    boardgamesPopular(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = [];
            try {
                const result = yield axios_1.default.get(variable_1.URL_POPULARBOARDGAME);
                const boardgamesJson = xml_js_1.default.xml2js(result.data);
                for (let i = 0; i < boardgamesJson.elements[0].elements.length; i++) {
                    if (i == 15)
                        break;
                    const tmp = boardgamesJson.elements[0].elements[i];
                    const boardgamePopular = {
                        id: tmp.attributes.id,
                        name: tmp.elements[1].attributes.value,
                        picture: tmp.elements[0].attributes.value,
                        year: tmp.elements[2].attributes.value,
                    };
                    data.push(boardgamePopular);
                }
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully find a popular boardgames",
                    data: data,
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    boardgameRecommendGuestUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const boardgame_name = req.body.boardgame_name.trim();
                const boardgameEntriesResult = [];
                const boardgameCurrent = yield boardgameRecommend_schema_1.boardgameRecommendModel.findOne({
                    game: { $eq: boardgame_name },
                });
                if (!boardgameCurrent) {
                    next(new BadRequestException_1.BadRequestException("there is no boardgame_name in the system"));
                }
                else {
                    const boardgameRecommendEntries = boardgameCurrent === null || boardgameCurrent === void 0 ? void 0 : boardgameCurrent.recommend;
                    const boardgameCurrentResult = yield boardgame_schema_1.boardgameModel
                        .findOne({
                        name: { $eq: boardgameCurrent.game },
                    })
                        .select("-_id id name minplayers maxplayers playingtime minage yearpublished description image");
                    for (let i = 0; i < boardgameRecommendEntries.length; i++) {
                        const boardgameDetailEachEntries = yield boardgame_schema_1.boardgameModel
                            .findOne({
                            name: { $eq: boardgameRecommendEntries[i] },
                        })
                            .select("-_id id name minplayers maxplayers playingtime minage yearpublished description image");
                        boardgameEntriesResult.push(boardgameDetailEachEntries);
                    }
                    res.status(200).json({
                        statusCode: 200,
                        message: "successfully recommend boardgames for guest user",
                        data: {
                            boardgameCurrentResult,
                            boardgameEntriesResult,
                        },
                    });
                }
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = BoardgameController;
