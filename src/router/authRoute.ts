import express, { Router } from "express";

// controller
import {
  register,
  loginPassword,
  loginGoogle,
  tokenRenew,
  detailUser,
  updatePassword,
} from "../function/auth/auth.controller";

// middleware
import checkAccessToken from "../middleware/checkAccessToken.middleware";
import checkRefreshToken from "../middleware/checkRefreshToken.middleware";
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import {
  RegisterDTO,
  LoginPasswordDTO,
  UpdatePasswordDTO,
  LoginGoogleDTO,
} from "../function/auth/auth.dto";

const router: Router = express.Router();

router.post(`/auth/register`, ValidationMiddleware(RegisterDTO), register);
router.post(
  `/auth/login-password`,
  ValidationMiddleware(LoginPasswordDTO),
  loginPassword
);
router.post(
  `/auth/login-google`,
  ValidationMiddleware(LoginGoogleDTO),
  loginGoogle
);
router.get(`/auth/new-token`, checkRefreshToken, tokenRenew);
router.get(`/auth/detail-user`, checkAccessToken, detailUser);
router.post(
  `/auth/password`,
  checkAccessToken,
  ValidationMiddleware(UpdatePasswordDTO),
  updatePassword
);

export default router;
