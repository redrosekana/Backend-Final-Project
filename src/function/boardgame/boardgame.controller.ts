import { NextFunction, Request, Response } from "express";
import axios from "axios";
import convert from "xml-js";

// model
import { boardgameRecommendModel } from "../../schema/boardgameRecommend.schema";
import { boardgameModel } from "../../schema/boardgame.schema";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

// enviroment variable
import { URL_POPULARBOARDGAME } from "../../config/variable";

class BoardgameController {
  public async boardgames(req: Request, res: Response, next: NextFunction) {
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

  public async boardgamesPopular(
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
          name: tmp.elements[1].attributes.value,
          picture: tmp.elements[2].attributes.value,
          year: tmp.elements[0].attributes.value,
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

  public async boardgameRecommendGuestUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const boardgameEntriesResult: any[] = [];
      const { boardgame_name } = req.body;
      const boardgameCurrent = await boardgameRecommendModel.findOne({
        game: { $eq: boardgame_name },
      });

      if (!boardgameCurrent) {
        next(
          new BadRequestException("there is no boardgame_name in the system")
        );
      } else {
        const boardgameRecommendEntries = boardgameCurrent?.recommend;
        const boardgameCurrentResult = await boardgameModel
          .findOne({
            name: { $eq: boardgameCurrent.game },
          })
          .select(
            "-_id id name minplayers maxplayers playingtime minage yearpublished description image"
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
}

export default BoardgameController;
