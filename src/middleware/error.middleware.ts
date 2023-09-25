import { Request, Response, NextFunction } from "express";

// exeption
import { HttpException } from "../exeptions/HttpException";

export default function ErrorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const cause = error.cause || "Internal Server Error";
  const message = error.message || "error in server";

  res.status(status).json({
    statusCode: status,
    error: cause,
    message: message,
  });
}
