import express, { Router } from "express";

// controller
import {
  boardgames,
  boardgameRecommendGuestUser,
  boardgamesPopular,
} from "../function/boardgame/boardgame.controller";

// middleware
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import { BoardgameRecommendGuessDTO } from "../function/boardgame/boardgame.dto";

const router: Router = express.Router();

router.get(`/boardgames`, boardgames);
router.get(`/boardgames/popular`, boardgamesPopular);
router.post(
  `/boardgames/guest`,
  ValidationMiddleware(BoardgameRecommendGuessDTO),
  boardgameRecommendGuestUser
);

export default router;
