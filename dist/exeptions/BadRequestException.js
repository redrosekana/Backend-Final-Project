"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const HttpException_1 = require("./HttpException");
class BadRequestException extends HttpException_1.HttpException {
    constructor(message) {
        super(400, "Bad Request", message);
        this.message = message;
    }
}
exports.BadRequestException = BadRequestException;
