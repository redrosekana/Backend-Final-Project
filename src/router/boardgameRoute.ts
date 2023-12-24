import express, { Router } from "express";

// controller
import {
  boardgames,
  boardgameRecommendGuestUser,
  boardgamesPopular,
  boardgameRecommendAuth,
} from "../function/boardgame/boardgame.controller";

// middleware
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import {
  BoardgameRecommendGuessDTO,
  BoardgameRecommendAuthDTO,
} from "../function/boardgame/boardgame.dto";

// middleware
import checkAccessToken from "../middleware/checkAccessToken.middleware";

const router: Router = express.Router();

router.get(`/boardgames`, boardgames);
router.get(`/boardgames/popular`, boardgamesPopular);
router.post(
  `/boardgames/guest`,
  ValidationMiddleware(BoardgameRecommendGuessDTO),
  boardgameRecommendGuestUser
);
router.post(
  "/boardgames/recommend",
  ValidationMiddleware(BoardgameRecommendAuthDTO),
  checkAccessToken,
  boardgameRecommendAuth
);

export default router;
