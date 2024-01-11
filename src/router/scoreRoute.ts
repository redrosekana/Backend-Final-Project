import express, { Router } from "express";

// controller
import { scoreBoardgame } from "../function/score/score.controller";

// dto
import { ScoreBoardgameDTO } from "../function/score/score.dto";
// middleware
import ValidationMiddleware from "../middleware/validation.middleware";
import checkAccessToken from "../middleware/checkAccessToken.middleware";

const router: Router = express.Router();

router.post(
  "/score",
  checkAccessToken,
  ValidationMiddleware(ScoreBoardgameDTO),
  scoreBoardgame
);

export default router;
