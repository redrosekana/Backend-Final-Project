import { Request, Response, NextFunction } from "express";

// model
import { boardgameModel } from "../../schema/boardgame.schema";
import { scoreModel } from "../../schema/score.schema";
import { userModel } from "../../schema/user.schema";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

export async function scoreBoardgame(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let score_entries = req.body.score_entries;
    let checkExistBoardgame = false;

    for (let i = 0; i < score_entries.length; i++) {
      const boardgame = await boardgameModel.findOne({
        name: { $eq: score_entries[i].name },
      });

      if (!boardgame) {
        checkExistBoardgame = true;
        break;
      }
    }

    if (checkExistBoardgame) {
      next(new BadRequestException("this boardgame doesn't exist in system"));
    } else {
      let user = await userModel.findOne({
        email: { $eq: req.payload.email },
        provider: { $eq: req.payload.provider },
      });

      let scoring = await scoreModel.findById(user?.scoring);
      let setScoreEntries = scoring?.scoreEntries;

      if (Array.isArray(setScoreEntries)) {
        for (let i = 0; i < score_entries.length; i++) {
          setScoreEntries = setScoreEntries
            .filter((entrie) => entrie.name !== score_entries[i].name)
            .map((entrie) => ({ name: entrie.name, score: entrie.score }));

          setScoreEntries = [
            ...setScoreEntries,
            { name: score_entries[i].name, score: score_entries[i].score },
          ];
        }
      }

      await scoreModel.findByIdAndUpdate(user?.scoring, {
        $set: { scoreEntries: setScoreEntries },
      });

      res.status(200).json({
        message: "successfully give a boardgame score",
        statusCode: 200,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}
