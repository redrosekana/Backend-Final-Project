import express, { Express, Request, Response, Router } from "express";

import UserController from "../function/user/user.controller";
import { UpdateUserDTO } from "../function/user/user.dto";
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
  }
}

export default UserRoute;
