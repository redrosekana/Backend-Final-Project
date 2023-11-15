import express, { Router } from "express";

// controller
import BoardgameController from "../function/boardgame/boardgame.controller";

// middleware
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import { BoardgameRecommendGuessDTO } from "../function/boardgame/boardgame.dto";

class BoardgameRoute {
  public router: Router;
  private path: string;
  private boardgameController: BoardgameController;

  constructor() {
    this.router = express.Router();
    this.path = "/boardgames";
    this.boardgameController = new BoardgameController();
    this.initialRoutes();
  }

  private initialRoutes() {
    this.router.get(`${this.path}`, this.boardgameController.boardgames);
    this.router.get(
      `${this.path}/popular`,
      this.boardgameController.boardgamesPopular
    );
    this.router.post(
      `${this.path}/guest`,
      ValidationMiddleware(BoardgameRecommendGuessDTO),
      this.boardgameController.boardgameRecommendGuestUser
    );
  }
}

export default BoardgameRoute;
