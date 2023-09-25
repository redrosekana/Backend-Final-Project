import express, { Router } from "express";

// controller
import ForgetPasswordController from "../function/forget-password/forget-password.controller";

// middleware
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import {
  SendEmailDTO,
  VerifyEmailDTO,
} from "../function/forget-password/forget-password.dto";

class ForgetPasswordRoute {
  public router: Router;
  private forgetPasswordController: ForgetPasswordController;

  constructor() {
    this.router = express.Router();
    this.forgetPasswordController = new ForgetPasswordController();
    this.initialRoutes();
  }

  private initialRoutes() {
    this.router.post(
      `/email`,
      ValidationMiddleware(SendEmailDTO),
      this.forgetPasswordController.sendEmail
    );

    this.router.post(
      "/email-verify",
      ValidationMiddleware(VerifyEmailDTO),
      this.forgetPasswordController.resetPassword
    );
  }
}

export default ForgetPasswordRoute;
