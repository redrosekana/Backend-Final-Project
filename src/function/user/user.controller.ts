import { Request, Response, NextFunction } from "express";

// model
import { userModel } from "../../schema/user.schema";

// exception
import { UnAuthorizationException } from "../../exeptions/UnAuthorizationException";
import { BadRequestException } from "../../exeptions/BadRequestException";

// interface
import { PayloadUser } from "../../interface/payload.interface";

class UserController {
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    const payload: PayloadUser = req.payload;
    const displayName = (req.body.displayName as string).trim();
    const username = (req.body.username as string).trim();

    if (await userModel.findOne({ displayName: { $eq: displayName } })) {
      next(new BadRequestException("displayName is repeated"));
    } else if (await userModel.findOne({ username: { $eq: username } })) {
      next(new BadRequestException("username is repeated"));
    } else {
      if (payload.provider === "password") {
        await userModel.findOneAndUpdate(
          { email: { $eq: payload.email } },
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
      } else if (payload.provider === "google") {
      } else {
        next(new UnAuthorizationException("failure updated user"));
      }
    }
  }
}
export default UserController;
