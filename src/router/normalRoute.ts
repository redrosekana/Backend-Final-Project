import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    api_name: "boardgame recommu",
    api_version: "1.0.0",
    api_released: "2023-09-24 13:30:35",
    api_documentation: null,
    api_status: "active",
  });
});

export default router;
