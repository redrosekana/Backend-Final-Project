import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

// exception
import { BadRequestException } from "../exeptions/BadRequestException";

export default function ValidationMiddleware(
  type: any,
  skipMissingProperties = false
) {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties }).then(
      (error: ValidationError[]) => {
        if (error.length > 0) {
          let message: any = [];

          for (let i = 0; i < error.length; i++) {
            message = [
              ...message,
              ...Object.values(error[i].constraints as any),
            ];
          }
          next(new BadRequestException(message));
        } else {
          next();
        }
      }
    );
  };
}
