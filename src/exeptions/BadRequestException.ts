import { HttpException } from "./HttpException";

export class BadRequestException extends HttpException {
  constructor(public message: string) {
    super(400, "Bad Request", message);
  }
}
