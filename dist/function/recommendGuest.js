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
// import model
const recommend_guest_1 = __importDefault(require("../model/recommend-guest"));
const boardgames_1 = __importDefault(require("../model/boardgames"));
function RecommendGuest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // ประกาศตัวแปรเก็บข้อมูลเกมที่จะแสดง
        const ResultBoardGameRecommend = [];
        let relationBoardGame = [];
        // ดึงค่าที่ส่งมา
        const { boardgameName } = req.query;
        if (!boardgameName) {
            res.status(400).json({ message: "need a boardgameName field" });
        }
        else {
            try {
                const boardgame = yield recommend_guest_1.default.findOne({ game: { $eq: boardgameName } });
                if (!boardgame) {
                    res.send(400).json({ message: "don't exist boardgame in database" });
                }
                else {
                    relationBoardGame = [...boardgame["recommend"]];
                    const currentData = yield boardgames_1.default.findOne({ name: { $eq: boardgame.game } }).select("-_id id name minplayers maxplayers playingtime minage yearpublished description image");
                    for (let i = 0; i < relationBoardGame.length; i++) {
                        const information = yield boardgames_1.default.findOne({ name: { $eq: relationBoardGame[i] } }).select("-_id id name minplayers maxplayers playingtime minage yearpublished description image");
                        if (!!information) {
                            const body = {
                                id: information.id,
                                name: information.name,
                                minplayers: information.minplayers,
                                maxplayers: information.maxplayers,
                                minage: information.minage,
                                playingtime: information.playingtime,
                                yearpublished: information.yearpublished,
                                description: information.description,
                                image: information.image
                            };
                            ResultBoardGameRecommend.push(body);
                        }
                    }
                    const result = {
                        currentData: currentData,
                        recommend: ResultBoardGameRecommend
                    };
                    res.status(200).json(result);
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: "occurred error in server" });
            }
        }
    });
}
exports.default = RecommendGuest;
