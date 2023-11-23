import express, { Router } from "express";

// controller
import { updateUser, changeAvatar } from "../function/user/user.controller";

// dto
import { UpdateUserDTO, ChangeAvatarDTO } from "../function/user/user.dto";

// middleware
import ValidationMiddleware from "../middleware/validation.middleware";
import checkAccessToken from "../middleware/checkAccessToken.middleware";

const router: Router = express.Router();

router.patch(
  "/users",
  checkAccessToken,
  ValidationMiddleware(UpdateUserDTO),
  updateUser
);

router.patch(
  "/users/avatar",
  checkAccessToken,
  ValidationMiddleware(ChangeAvatarDTO),
  changeAvatar
);

export default router;
