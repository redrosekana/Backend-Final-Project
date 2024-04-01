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
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreBoardgame = void 0;
// model
const boardgame_schema_1 = require("../../schema/boardgame.schema");
const score_schema_1 = require("../../schema/score.schema");
const user_schema_1 = require("../../schema/user.schema");
// exception
const BadRequestException_1 = require("../../exeptions/BadRequestException");
function scoreBoardgame(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let name = req.body.name.trim();
            let score = req.body.score;
            let checkExistBoardgame = false;
            const boardgame = yield boardgame_schema_1.boardgameModel.findOne({
                name: { $eq: name },
            });
            if (!boardgame) {
                checkExistBoardgame = true;
            }
            if (checkExistBoardgame) {
                next(new BadRequestException_1.BadRequestException("this boardgame doesn't exist in system"));
            }
            else {
                let user = yield user_schema_1.userModel.findOne({
                    email: { $eq: req.payload.email },
                    provider: { $eq: req.payload.provider },
                });
                let scoring = yield score_schema_1.scoreModel.findById(user === null || user === void 0 ? void 0 : user.scoring);
                let setScoreEntries = scoring === null || scoring === void 0 ? void 0 : scoring.scoreEntries;
                setScoreEntries = setScoreEntries === null || setScoreEntries === void 0 ? void 0 : setScoreEntries.filter((entrie) => entrie.name !== name).map((entrie) => ({ name: entrie.name, score: entrie.score }));
                if (Array.isArray(setScoreEntries)) {
                    setScoreEntries = [...setScoreEntries, { name: name, score: score }];
                }
                yield score_schema_1.scoreModel.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user.scoring, {
                    $set: { scoreEntries: setScoreEntries },
                });
                res.status(200).json({
                    message: "successfully give a boardgame score",
                    statusCode: 200,
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.scoreBoardgame = scoreBoardgame;
