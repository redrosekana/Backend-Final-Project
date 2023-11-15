import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// exeption
import { UnAuthorizationException } from "../exeptions/UnAuthorizationException";
import { SECRET_REFRESHTOKEN } from "../config/variable";

export default async function checkRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractHeaderToken(req);
    if (!token) {
      next(new UnAuthorizationException("required token"));
    } else {
      const payload = jwt.verify(token, SECRET_REFRESHTOKEN);
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
