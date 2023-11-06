import express, { Router } from "express";

import UserController from "../function/user/user.controller";
import { UpdateUserDTO, ChangeAvatarDTO } from "../function/user/user.dto";
import ValidationMiddleware from "../middleware/validation.middleware";
import checkAccessToken from "../middleware/checkAccessToken.middleware";

class UserRoute {
  public router: Router;
  private path: string;
  private userController: UserController;

  constructor() {
    this.router = express.Router();
    this.path = "/users";
    this.userController = new UserController();
    this.initialRoutes();
  }

  private initialRoutes() {
    this.router.patch(
      `${this.path}`,
      checkAccessToken,
      ValidationMiddleware(UpdateUserDTO),
      this.userController.updateUser
    );

    this.router.patch(
      `${this.path}/avatar`,
      checkAccessToken,
      ValidationMiddleware(ChangeAvatarDTO),
      this.userController.changeAvatar
    );
  }
}

export default UserRoute;
