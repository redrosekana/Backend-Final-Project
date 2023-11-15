"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(status, cause, message) {
        super(message);
        this.status = status;
        this.cause = cause;
        this.message = message;
    }
}
exports.HttpException = HttpException;
