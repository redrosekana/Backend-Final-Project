import express, { Router } from "express";

// controller
import {
  resetPassword,
  sendEmail,
} from "../function/forget-password/forget-password.controller";

// middleware
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import {
  SendEmailDTO,
  VerifyEmailDTO,
} from "../function/forget-password/forget-password.dto";

const router: Router = express.Router();

router.post(`/email`, ValidationMiddleware(SendEmailDTO), sendEmail);
router.post(
  "/email-verify",
  ValidationMiddleware(VerifyEmailDTO),
  resetPassword
);

export default router;
