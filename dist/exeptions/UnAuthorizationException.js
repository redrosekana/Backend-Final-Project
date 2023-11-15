"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnAuthorizationException = void 0;
const HttpException_1 = require("./HttpException");
class UnAuthorizationException extends HttpException_1.HttpException {
    constructor(message) {
        super(401, "UnAuthorized", message);
        this.message = message;
    }
}
exports.UnAuthorizationException = UnAuthorizationException;
