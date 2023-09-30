import { Request, Response, NextFunction } from "express";

// model
import { userModel } from "../../schema/user.schema";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

// interface
import { PayloadUser } from "../../interface/payload.interface";

class UserController {
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: PayloadUser = req.payload;
      if (payload.provider === "password") {
        const displayName = (req.body.displayName as string).trim();
        const username = (req.body.username as string).trim();
        const user = await userModel.findOne({
          email: { $eq: payload.email },
          provider: { $eq: "password" },
        });

        if (
          (await userModel.findOne({
            username: { $eq: username },
            provider: { $eq: payload.provider },
          })) &&
          user?.username !== username
        ) {
          next(new BadRequestException("username is repeated"));
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default UserController;
