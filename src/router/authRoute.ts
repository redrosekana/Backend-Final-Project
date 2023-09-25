import express, { Router } from "express";

// controller
import AuthController from "../function/auth/auth.controller";

// middleware
import checkAccessToken from "../middleware/checkAccessToken.middleware";
import checkRefreshToken from "../middleware/checkRefreshToken.middleware";
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import {
  RegisterDTO,
  LoginPasswordDTO,
  UpdatePasswordDTO,
} from "../function/auth/auth.dto";

class AuthRoute {
  public router: Router;
  private path: string;
  private authController: AuthController;

  constructor() {
    this.router = express.Router();
    this.path = "/auth";
    this.authController = new AuthController();
    this.initialRoutes();
  }

  private initialRoutes() {
    this.router.post(
      `${this.path}/register`,
      ValidationMiddleware(RegisterDTO),
      this.authController.register
    );
    this.router.post(
      `${this.path}/login-password`,
      ValidationMiddleware(LoginPasswordDTO),
      this.authController.loginPassword
    );
    this.router.get(
      `${this.path}/new-token`,
      checkRefreshToken,
      this.authController.tokenRenew
    );
    this.router.get(
      `${this.path}/detail-user`,
      checkAccessToken,
      this.authController.detailUser
    );
    this.router.post(
      `${this.path}/password`,
      checkAccessToken,
      ValidationMiddleware(UpdatePasswordDTO),
      this.authController.updatePassword
    );
  }
}

export default AuthRoute;
