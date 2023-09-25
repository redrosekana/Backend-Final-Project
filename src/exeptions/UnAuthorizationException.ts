import { HttpException } from "./HttpException";

export class UnAuthorizationException extends HttpException {
  constructor(public message: string) {
    super(401, "UnAuthorized", message);
  }
}
