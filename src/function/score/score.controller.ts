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
    let name = req.body.name as string;
    let score = req.body.score as number;
    let boardgame = await boardgameModel.findOne({ name: { $eq: name } });

    if (!boardgame) {
      next(new BadRequestException("this boardgame doesn't exist in system"));
    } else {
      let user = await userModel.findOne({
        email: { $eq: req.payload.email },
        provider: { $eq: req.payload.provider },
      });

      let scoring = await scoreModel.findById(user?.scoring);
      let setScoreEntries = scoring?.scoreEntries;

      if (Array.isArray(setScoreEntries)) {
        setScoreEntries = setScoreEntries
          .filter((entrie) => entrie.name !== name)
          .map((entrie) => ({ name: entrie.name, score: entrie.score }));
      }

      await scoreModel.findByIdAndUpdate(user?.scoring, {
        $set: { scoreEntries: setScoreEntries },
      });
      await scoreModel.findByIdAndUpdate(user?.scoring, {
        $push: { scoreEntries: { name, score } },
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
