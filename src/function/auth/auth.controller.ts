import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

// model
import { userModel } from "../../schema/user.schema";
import { scoreModel } from "../../schema/score.schema";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";
import { UnAuthorizationException } from "../../exeptions/UnAuthorizationException";

// interface
import { PayloadUser } from "../../interface/payload.interface";

// enviroment variable
import {
  SALT,
  SECRET_ACCESSTOKEN,
  SECRET_REFRESHTOKEN,
  URL_CLOUDSTORAGE,
} from "../../config/variable";

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const displayName: string = (req.body.displayName as string).trim();
    const username: string = (req.body.username as string).trim();
    const password: string = (req.body.password as string).trim();
    const email: string = (req.body.email as string).trim();

    if (await userModel.findOne({ displayName: { $eq: displayName } })) {
      next(new BadRequestException("displayName is repeated"));
    } else if (await userModel.findOne({ username: { $eq: username } })) {
      next(new BadRequestException("username is repeated"));
    } else if (await userModel.findOne({ email: { $eq: email } })) {
      next(new BadRequestException("email is repeated"));
    } else {
      const salt = await bcrypt.genSalt(SALT);
      const passwordEncrypt = await bcrypt.hash(password, salt);
      const scoring = await scoreModel.create({
        scoreEntries: [],
      });

      await userModel.create({
        displayName: displayName,
        username: username,
        password: passwordEncrypt,
        urlAvatar: `${URL_CLOUDSTORAGE}/avatar-maker/avatar-${
          1 + Math.floor(Math.random() * 60)
        }.svg`,
        email: email,
        provider: "password",
        scoring: scoring.id,
      });

      res.status(201).json({
        statusCode: 201,
        message: "successfully created user",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function loginPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const username: string = (req.body.username as string).trim();
    const password: string = (req.body.password as string).trim();
    const user = await userModel.findOne({
      username: { $eq: username },
      provider: { $eq: "password" },
    });

    if (!user) {
      next(new UnAuthorizationException("there is no username in the system"));
    } else {
      const passwordCheck = await bcrypt.compare(
        password,
        user.password as string
      );

      if (!passwordCheck) {
        next(new UnAuthorizationException("invalid password"));
      } else {
        const payload: PayloadUser = {
          displayName: user.displayName,
          email: user.email,
          provider: user.provider,
        };
        const accessToken = jwt.sign(payload, SECRET_ACCESSTOKEN, {
          expiresIn: "6000000ms",
        });
        const refreshToken = jwt.sign(payload, SECRET_REFRESHTOKEN, {
          expiresIn: "1800000ms",
        });

        res.status(200).json({
          statusCode: 200,
          message: "successfully login user",
          accessToken,
          refreshToken,
        });
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function loginGoogle(req: Request, res: Response, next: NextFunction) {
  try {
    const google_token: string = (req.body.google_token as string).trim();
    const client = new OAuth2Client();

    const result = await client.verifyIdToken({
      idToken: google_token,
    });

    const googlePayload = result.getPayload();
    const user = await userModel.findOne({
      email: googlePayload?.email,
      provider: "google",
    });

    if (!user) {
      const scoring = await scoreModel.create({
        scoreEntries: [],
      });

      await userModel.create({
        displayName: "guest",
        email: googlePayload?.email,
        urlAvatar: `${URL_CLOUDSTORAGE}/avatar-maker/avatar-${
          1 + Math.floor(Math.random() * 60)
        }.svg`,
        provider: "google",
        scoring: scoring.id,
      });
    }

    const payload: PayloadUser = {
      displayName: user?.displayName || "guest",
      email: user?.email || googlePayload?.email,
      provider: "google",
    };
    const accessToken = jwt.sign(payload, SECRET_ACCESSTOKEN, {
      expiresIn: "6000000ms",
    });
    const refreshToken = jwt.sign(payload, SECRET_REFRESHTOKEN, {
      expiresIn: "1800000ms",
    });

    res.status(200).json({
      statusCode: 200,
      message: "successfully login user",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function tokenRenew(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: PayloadUser = req.payload;
    const user = await userModel.findOne({
      email: { $eq: payload.email },
      provider: { $eq: payload.provider },
    });

    if (!user) {
      next(new UnAuthorizationException("access denied for user"));
    } else {
      const payload: PayloadUser = {
        displayName: user.displayName,
        email: user.email,
        provider: user.provider,
      };
      const accessToken = jwt.sign(payload, SECRET_ACCESSTOKEN, {
        expiresIn: "600000ms",
      });
      const refreshToken = jwt.sign(payload, SECRET_REFRESHTOKEN, {
        expiresIn: "1800000ms",
      });

      res.status(200).json({
        statusCode: 200,
        message: "successfully renew token",
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function detailUser(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: PayloadUser = req.payload;
    const user = await userModel
      .findOne({
        email: { $eq: payload.email },
        provider: { $eq: payload.provider },
      })
      .populate({
        path: "ownerParty",
        select: {
          __v: 0,
        },
        populate: [
          {
            path: "owner",
            select: {
              displayName: 1,
              urlAvatar: 1,
              email: 1,
            },
          },
          {
            path: "member",
            select: {
              displayName: 1,
              urlAvatar: 1,
              email: 1,
            },
          },
        ],
      })
      .populate({
        path: "memberParty",
        select: {
          __v: 0,
        },
        populate: [
          {
            path: "owner",
            select: {
              displayName: 1,
              urlAvatar: 1,
              email: 1,
            },
          },
          {
            path: "member",
            select: {
              displayName: 1,
              urlAvatar: 1,
              email: 1,
            },
          },
        ],
      })
      .populate({
        path: "scoring",
        select: {
          __v: 0,
          _id: 0,
        },
      })
      .select("-password -__v");

    res.status(200).json({
      statusCode: 200,
      message: "user is authenticated",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: PayloadUser = req.payload;
    const password_old: string = (req.body.password_old as string).trim();
    const password_new: string = (req.body.password_new as string).trim();
    const user = await userModel.findOne({
      email: { $eq: payload.email },
      provider: { $eq: "password" },
    });
    const checkPassword = await bcrypt.compare(
      password_old,
      user?.password as string
    );

    console.log("ok");

    if (!checkPassword) {
      next(new UnAuthorizationException("invalid old password"));
    } else {
      const salt = await bcrypt.genSalt(SALT);
      const passwordNewEncrypt = await bcrypt.hash(password_new, salt);
      await userModel.findOneAndUpdate(
        { email: req.payload.email, provider: { $eq: payload.provider } },
        {
          $set: {
            password: passwordNewEncrypt,
          },
        }
      );

      res.status(200).json({
        statusCode: 200,
        message: "successfully updated password",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export {
  register,
  loginPassword,
  loginGoogle,
  tokenRenew,
  detailUser,
  updatePassword,
};
