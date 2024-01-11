import { Request, Response, NextFunction } from "express";

// model
import { userModel } from "../../schema/user.schema";
import { scoreModel } from "../../schema/score.schema";
import { boardgameModel } from "../../schema/boardgame.schema";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

// interface
import { PayloadUser } from "../../interface/payload.interface";

async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: PayloadUser = req.payload;

    if (payload.provider === "password") {
      const displayName = (req.body.displayName as string).trim();
      const username = (req.body.username as string).trim();

      const currentUser = await userModel.findOne({
        email: { $eq: payload.email },
        provider: { $eq: "password" },
      });

      const checkRepeatUsername = await userModel.findOne({
        username: { $eq: username },
        provider: { $eq: "password" },
      });

      const checkRepeatDisplayName = await userModel.findOne({
        displayName: { $eq: displayName },
      });

      if (checkRepeatUsername && currentUser?.username !== username) {
        next(new BadRequestException("username is repeated"));
      } else if (
        checkRepeatDisplayName &&
        currentUser?.displayName !== displayName
      ) {
        next(new BadRequestException("displayName is repeated"));
      } else {
        await userModel.findOneAndUpdate(
          {
            email: { $eq: payload.email },
            provider: { $eq: "password" },
          },
          {
            $set: {
              displayName,
              username,
            },
          }
        );

        res.status(202).json({
          statusCode: 202,
          message: "successfully update user",
        });
      }
    } else {
      const displayName = (req.body.displayName as string).trim();

      const currentUser = await userModel.findOne({
        email: { $eq: payload.email },
        provider: { $eq: "google" },
      });

      const checkRepeatDisplayName = await userModel.findOne({
        displayName: { $eq: displayName },
      });

      if (checkRepeatDisplayName && currentUser?.displayName !== displayName) {
        next(new BadRequestException("displayName is repeated"));
      } else {
        await userModel.findOneAndUpdate(
          {
            email: { $eq: payload.email },
            provider: { $eq: payload.provider },
          },
          {
            $set: {
              displayName,
            },
          }
        );
        res.status(202).json({
          statusCode: 202,
          message: "successfully update user",
        });
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function changeAvatar(req: Request, res: Response, next: NextFunction) {
  const payload: PayloadUser = req.payload;
  const url = (req.body.url as string).trim();

  // for check url
  const checkUrl = new URL(url);

  const currentUser = await userModel.findOne({
    email: { $eq: payload.email },
    provider: { $eq: payload.provider },
  });

  if (
    checkUrl.origin !== "https://storage.googleapis.com" ||
    !/\/boardgame-recommu\/avatar-maker\/avatar\-\d{1,2}\.svg/gi.test(
      checkUrl.pathname
    )
  ) {
    next(
      new BadRequestException("url which is used for urlAvatar incorrectly")
    );
  } else if (!currentUser) {
    next(new BadRequestException("there isn't user in system"));
  } else {
    await userModel.findOneAndUpdate(
      {
        email: { $eq: payload.email },
        provider: { $eq: payload.provider },
      },
      { $set: { urlAvatar: url } }
    );

    res.status(200).json({
      statusCode: 200,
      message: "successfully change a profile avatar",
    });
  }
}

async function removeScoreBoardgame(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, provider } = req.payload;
  const { scoreBoardgameNameEntries } = req.body;

  const currentUser = await userModel.findOne({
    email: { $eq: email },
    provider: { $eq: provider },
  });
  const scoringOfCurrentUser = await scoreModel.findById(currentUser?.scoring);
  let scoreEntriesOfCurrentUser = scoringOfCurrentUser?.scoreEntries;

  for (let i = 0; i < scoreBoardgameNameEntries.length; i++) {
    if (Array.isArray(scoreEntriesOfCurrentUser)) {
      scoreEntriesOfCurrentUser = scoreEntriesOfCurrentUser?.filter(
        (entrie) => entrie.name !== scoreBoardgameNameEntries[i]
      );
    }
  }

  scoreEntriesOfCurrentUser = scoreEntriesOfCurrentUser?.map((entrie) => ({
    name: entrie.name,
    score: entrie.score,
  }));

  await scoreModel.findByIdAndUpdate(currentUser?.scoring, {
    $set: { scoreEntries: scoreEntriesOfCurrentUser },
  });

  try {
    res.status(200).json({
      statusCode: 200,
      message: "successfully remove scoring boardgame",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export { updateUser, changeAvatar, removeScoreBoardgame };
