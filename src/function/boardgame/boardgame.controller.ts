import { NextFunction, Request, Response } from "express";
import axios from "axios";
import convert from "xml-js";
import _ from "lodash";

// model
import { boardgameRecommendModel } from "../../schema/boardgameRecommend.schema";
import { boardgameModel } from "../../schema/boardgame.schema";
import { userModel } from "../../schema/user.schema";
import { scoreModel } from "../../schema/score.schema";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

// enviroment variable
import { URL_POPULARBOARDGAME } from "../../config/variable";
import { URL_SERVICE_MODEL } from "../../config/variable";

async function boardgames(req: Request, res: Response, next: NextFunction) {
  try {
    const boardgames = await boardgameRecommendModel.find({});
    res.status(200).json({
      statusCode: 200,
      message: "successfully findAll boardgames",
      data: boardgames,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function boardgamesPopular(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = [];

  try {
    const result = await axios.get(URL_POPULARBOARDGAME);
    const boardgamesJson = convert.xml2js(result.data);

    for (let i = 0; i < boardgamesJson.elements[0].elements.length; i++) {
      if (i == 15) break;
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
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function boardgameRecommendGuestUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const boardgame_name: string = (req.body.boardgame_name as string).trim();
    const boardgameEntriesResult: any[] = [];
    const boardgameCurrent = await boardgameRecommendModel.findOne({
      game: { $eq: boardgame_name },
    });

    if (!boardgameCurrent) {
      next(new BadRequestException("there isn't a boardgame in the system"));
    } else {
      const boardgameRecommendEntries = boardgameCurrent?.recommend;
      const boardgameCurrentResult = await boardgameModel
        .findOne({
          name: { $eq: boardgameCurrent.game },
        })
        .select(
          "-_id id name minplayers maxplayers playingtime minage weight yearpublished description image"
        );

      for (let i = 0; i < boardgameRecommendEntries.length; i++) {
        const boardgameDetailEachEntries = await boardgameModel
          .findOne({
            name: { $eq: boardgameRecommendEntries[i] },
          })
          .select(
            "-_id id name minplayers maxplayers playingtime minage yearpublished description image"
          );
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
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function boardgameRecommendAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const OPTION = ["select_1", "select_2", "select_3"];
    const MAPPING_TIME: Record<string, any> = {
      select_1: { $lte: 30 }, // น้อยกว่าเท่ากับ 30 นาที
      select_2: { $lte: 60, $gt: 30 }, // มากกว่า 30 นาที แต่น้อยกว่าเท่ากับ 60 นาที
      select_3: { $gt: 60 }, // มากกว่า 1 ชั่วโมง
    };

    const MAPPING_WEIGHT: Record<string, any> = {
      select_1: { $lte: 1.8 }, // น้อยกว่าเท่ากับ 1.5
      select_2: { $lte: 2.8, $gt: 1.8 }, // มากกว่าเท่ากับ 1.5 แต่น้อยกว่าเท่ากับ 3.5
      select_3: { $gt: 2.8 }, // มากกว่า 3.5
    };

    const MAPPING_PLAYERS_MIN: Record<string, any> = {
      select_1: { $in: [1, 2] }, // มากกว่าเท่ากับ 1 แต่น้อยกว่าเท่ากับ 2
      select_2: { $in: [1, 2, 3, 4, 5] }, // มากกว่าเท่ากับ 3 แต่น้อยกว่าเท่ากับ 5
      select_3: { $in: [1, 2, 3, 4, 5] }, // มากกว่าเท่ากับ 5
    };

    const MAPPING_PLAYERS_MAX: Record<string, any> = {
      select_1: { $in: [1, 2] }, // น้อยกว่าเท่ากับ 2
      select_2: { $in: [3, 4, 5] }, // น้อยกว่าเท่ากับ 5
      select_3: { $gt: 5 }, // มากกว่า 5
    };

    const time = (req.body.time as string).trim();
    const weight = (req.body.weight as string).trim();
    const players = (req.body.players as string).trim();

    if (
      (time && !OPTION.find((option) => time === option)) ||
      (weight && !OPTION.find((option) => weight === option)) ||
      (players && !OPTION.find((option) => players === option))
    ) {
      next(new BadRequestException("data which was send is invalid"));
    } else {
      let user = await userModel.findOne({
        email: { $eq: req.payload.email },
        provider: { $eq: req.payload.provider },
      });

      let scoring = await scoreModel.findById(user?.scoring);
      let queryResult;
      let result = [];

      if (
        Array.isArray(scoring?.scoreEntries) &&
        scoring!.scoreEntries.length > 0
      ) {
        queryResult = await boardgameModel
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
                category:
                  req.body.category.length > 0
                    ? { $in: req.body.category }
                    : { $exists: true },
              },
            ],
          })
          .select("-__v -_id");
        // name playingtime weight minplayers category rank

        const bodyExcuteModel: Record<string, number> = {};
        if (Array.isArray(scoring?.scoreEntries)) {
          for (let i = 0; i < scoring!.scoreEntries.length; i++) {
            const key = scoring!.scoreEntries[i].name;
            const value = scoring!.scoreEntries[i].score;
            bodyExcuteModel[key] = value;
          }
        }

        const resultFromModel = await axios({
          url: `${URL_SERVICE_MODEL}/boardgames-recommend`,
          method: "post",
          data: bodyExcuteModel,
          timeout: 30000,
        });

        let modelInformation = resultFromModel.data.score as Record<
          string,
          number
        >;

        let adjustModelInformation = _(modelInformation)
          .toPairs()
          .orderBy([1], ["desc"])
          .value();

        for (let i = 0; i < adjustModelInformation.length; i++) {
          if (result.length === 10) break;

          const choosenQuery = queryResult.find(
            (e) => e.name === adjustModelInformation[i][0]
          );

          if (choosenQuery) result.push(choosenQuery);
        }
      } else {
        queryResult = await boardgameModel
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
                category:
                  req.body.category.length > 0
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
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export {
  boardgames,
  boardgameRecommendGuestUser,
  boardgamesPopular,
  boardgameRecommendAuth,
};
