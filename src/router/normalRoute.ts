import express, { Request, Response, Router } from "express";

class NormalRoute {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initialRoutes();
  }

  private initialRoutes() {
    this.router.get("/", (req: Request, res: Response) => {
      res.status(200).json({
        api_name: "boardgame recommu",
        api_version: "1.0.0",
        api_released: "2023-09-24 13:30:35",
        api_documentation: null,
        api_status: "active",
      });
    });
  }
}

export default NormalRoute;
