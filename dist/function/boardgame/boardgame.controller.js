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
exports.boardgameRecommendAuth = exports.boardgamesPopular = exports.boardgameRecommendGuestUser = exports.boardgames = void 0;
const axios_1 = __importDefault(require("axios"));
const xml_js_1 = __importDefault(require("xml-js"));
const lodash_1 = __importDefault(require("lodash"));
// model
const boardgameRecommend_schema_1 = require("../../schema/boardgameRecommend.schema");
const boardgame_schema_1 = require("../../schema/boardgame.schema");
const user_schema_1 = require("../../schema/user.schema");
const score_schema_1 = require("../../schema/score.schema");
// exception
const BadRequestException_1 = require("../../exeptions/BadRequestException");
// enviroment variable
const variable_1 = require("../../config/variable");
const variable_2 = require("../../config/variable");
function boardgames(req, res, next) {
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
exports.boardgames = boardgames;
function boardgamesPopular(req, res, next) {
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
                    name: tmp.elements[1] ? tmp.elements[1].attributes.value : "",
                    picture: tmp.elements[0] ? tmp.elements[0].attributes.value : "",
                    year: tmp.elements[2] ? tmp.elements[2].attributes.value : "",
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
exports.boardgamesPopular = boardgamesPopular;
function boardgameRecommendGuestUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const boardgame_name = req.body.boardgame_name.trim();
            const boardgameEntriesResult = [];
            const boardgameCurrent = yield boardgameRecommend_schema_1.boardgameRecommendModel.findOne({
                game: { $eq: boardgame_name },
            });
            if (!boardgameCurrent) {
                next(new BadRequestException_1.BadRequestException("there isn't a boardgame in the system"));
            }
            else {
                const boardgameRecommendEntries = boardgameCurrent === null || boardgameCurrent === void 0 ? void 0 : boardgameCurrent.recommend;
                const boardgameCurrentResult = yield boardgame_schema_1.boardgameModel
                    .findOne({
                    name: { $eq: boardgameCurrent.game },
                })
                    .select("-_id id name minplayers maxplayers playingtime minage weight yearpublished description image");
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
exports.boardgameRecommendGuestUser = boardgameRecommendGuestUser;
function boardgameRecommendAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const OPTION = ["select_1", "select_2", "select_3"];
            const MAPPING_TIME = {
                select_1: { $lte: 30 }, // น้อยกว่าเท่ากับ 30 นาที
                select_2: { $lte: 60, $gt: 30 }, // มากกว่า 30 นาที แต่น้อยกว่าเท่ากับ 60 นาที
                select_3: { $gt: 60 }, // มากกว่า 1 ชั่วโมง
            };
            const MAPPING_WEIGHT = {
                select_1: { $lte: 1.8 }, // น้อยกว่าเท่ากับ 1.5
                select_2: { $lte: 2.8, $gt: 1.8 }, // มากกว่าเท่ากับ 1.5 แต่น้อยกว่าเท่ากับ 3.5
                select_3: { $gt: 2.8 }, // มากกว่า 3.5
            };
            const MAPPING_PLAYERS_MIN = {
                select_1: { $in: [1, 2] }, // มากกว่าเท่ากับ 1 แต่น้อยกว่าเท่ากับ 2
                select_2: { $in: [1, 2, 3, 4, 5] }, // มากกว่าเท่ากับ 3 แต่น้อยกว่าเท่ากับ 5
                select_3: { $in: [1, 2, 3, 4, 5] }, // มากกว่าเท่ากับ 5
            };
            const MAPPING_PLAYERS_MAX = {
                select_1: { $in: [1, 2] }, // น้อยกว่าเท่ากับ 2
                select_2: { $in: [3, 4, 5] }, // น้อยกว่าเท่ากับ 5
                select_3: { $gt: 5 }, // มากกว่า 5
            };
            const time = req.body.time.trim();
            const weight = req.body.weight.trim();
            const players = req.body.players.trim();
            if ((time && !OPTION.find((option) => time === option)) ||
                (weight && !OPTION.find((option) => weight === option)) ||
                (players && !OPTION.find((option) => players === option))) {
                next(new BadRequestException_1.BadRequestException("data which was send is invalid"));
            }
            else {
                let user = yield user_schema_1.userModel.findOne({
                    email: { $eq: req.payload.email },
                    provider: { $eq: req.payload.provider },
                });
                let scoring = yield score_schema_1.scoreModel.findById(user === null || user === void 0 ? void 0 : user.scoring);
                let queryResult;
                let result = [];
                if (Array.isArray(scoring === null || scoring === void 0 ? void 0 : scoring.scoreEntries) &&
                    scoring.scoreEntries.length > 0) {
                    queryResult = yield boardgame_schema_1.boardgameModel
                        .find({
                        $and: [
                            {
                                playingtime: req.body.time
                                    ? MAPPING_TIME[req.body.time]
                                    : { $exists: true },
                            },
                            {
                                weight: req.body.weight
                                    ? MAPPING_WEIGHT[req.body.weight]
                                    : { $exists: true },
                            },
                            {
                                minplayers: req.body.players
                                    ? MAPPING_PLAYERS_MIN[req.body.players]
                                    : { $exists: true },
                            },
                            {
                                maxplayers: req.body.players
                                    ? MAPPING_PLAYERS_MAX[req.body.players]
                                    : { $exists: true },
                            },
                            {
                                category: req.body.category.length > 0
                                    ? { $in: req.body.category }
                                    : { $exists: true },
                            },
                        ],
                    })
                        .select("-__v -_id");
                    // name playingtime weight minplayers category rank
                    const bodyExcuteModel = {};
                    if (Array.isArray(scoring === null || scoring === void 0 ? void 0 : scoring.scoreEntries)) {
                        for (let i = 0; i < scoring.scoreEntries.length; i++) {
                            const key = scoring.scoreEntries[i].name;
                            const value = scoring.scoreEntries[i].score;
                            bodyExcuteModel[key] = value;
                        }
                    }
                    const resultFromModel = yield (0, axios_1.default)({
                        url: `${variable_2.URL_SERVICE_MODEL}/boardgames-recommend`,
                        method: "post",
                        data: bodyExcuteModel,
                        timeout: 30000,
                    });
                    let modelInformation = resultFromModel.data.score;
                    let adjustModelInformation = (0, lodash_1.default)(modelInformation)
                        .toPairs()
                        .orderBy([1], ["desc"])
                        .value();
                    for (let i = 0; i < adjustModelInformation.length; i++) {
                        if (result.length === 10)
                            break;
                        const choosenQuery = queryResult.find((e) => e.name === adjustModelInformation[i][0]);
                        if (choosenQuery)
                            result.push(choosenQuery);
                    }
                }
                else {
                    queryResult = yield boardgame_schema_1.boardgameModel
                        .find({
                        $and: [
                            {
                                playingtime: req.body.time
                                    ? MAPPING_TIME[req.body.time]
                                    : { $exists: true },
                            },
                            {
                                weight: req.body.weight
                                    ? MAPPING_WEIGHT[req.body.weight]
                                    : { $exists: true },
                            },
                            {
                                minplayers: req.body.players
                                    ? MAPPING_PLAYERS_MIN[req.body.players]
                                    : { $exists: true },
                            },
                            {
                                maxplayers: req.body.players
                                    ? MAPPING_PLAYERS_MAX[req.body.players]
                                    : { $exists: true },
                            },
                            {
                                category: req.body.category.length > 0
                                    ? { $in: req.body.category }
                                    : { $exists: true },
                            },
                        ],
                    })
                        .select("-__v -_id")
                        .sort("rank")
                        .limit(10);
                    result = [...queryResult];
                }
                res.status(200).json({
                    message: "ok",
                    statusCode: 200,
                    data: result,
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.boardgameRecommendAuth = boardgameRecommendAuth;
