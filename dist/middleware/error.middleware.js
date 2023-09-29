"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ErrorMiddleware(error, req, res, next) {
    const status = error.status || 500;
    const cause = error.cause || "Internal Server Error";
    const message = error.message || "error in server";
    res.status(status).json({
        statusCode: status,
        error: cause,
        message: message,
    });
}
exports.default = ErrorMiddleware;
