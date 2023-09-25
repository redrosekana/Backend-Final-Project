import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// exeption
import { UnAuthorizationException } from "../exeptions/UnAuthorizationException";
import { SECRET_ACCESSTOKEN } from "../config/variable";

export default async function checkAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractHeaderToken(req);
    if (!token) {
      next(new UnAuthorizationException("required token"));
    } else {
      const payload = jwt.verify(token, SECRET_ACCESSTOKEN);
      req.payload = payload;
      next();
    }
  } catch (error) {
    console.log(error);
    next(new UnAuthorizationException("required token"));
  }
}

function extractHeaderToken(req: Request): string | undefined {
  const [type, token] = req.headers.authorization!.split(" ");
  return type === "Bearer" ? token : undefined;
}
