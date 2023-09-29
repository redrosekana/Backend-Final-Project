import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

// model
import { userModel } from "../../schema/user.schema";

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
} from "../../config/variable";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
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
        await userModel.create({
          displayName: displayName,
          username: username,
          password: passwordEncrypt,
          email: email,
          provider: "password",
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

  public async loginPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const username: string = (req.body.username as string).trim();
      const password: string = (req.body.password as string).trim();
      const user = await userModel.findOne({ username: { $eq: username } });

      if (!user) {
        next(
          new UnAuthorizationException("there is no username in the system")
        );
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

  public async tokenRenew(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userModel.findOne({
        email: { $eq: req.payload.email },
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

  public async detailUser(req: Request, res: Response) {
    const payload: PayloadUser = req.payload;
    const user = await userModel
      .findOne({ email: { $eq: payload.email } })
      .select("-password -__v");
    res.status(200).json({
      statusCode: 200,
      message: "user is authenticated",
      data: user,
    });
  }

  public async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const password_old: string = (req.body.password_old as string).trim();
      const password_new: string = (req.body.password_new as string).trim();
      const user = await userModel.findOne({
        email: { $eq: req.payload.email },
      });
      const checkPassword = await bcrypt.compare(
        password_old,
        user?.password as string
      );

      if (!checkPassword) {
        next(new UnAuthorizationException("invalid old password"));
      } else {
        const salt = await bcrypt.genSalt(SALT);
        const passwordNewEncrypt = await bcrypt.hash(password_new, salt);
        await userModel.findOneAndUpdate(
          { email: req.payload.email },
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
}

export default AuthController;
