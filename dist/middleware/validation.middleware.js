"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
// exception
const BadRequestException_1 = require("../exeptions/BadRequestException");
function ValidationMiddleware(type, skipMissingProperties = false) {
    return (req, res, next) => {
        (0, class_validator_1.validate)((0, class_transformer_1.plainToInstance)(type, req.body), { skipMissingProperties }).then((error) => {
            if (error.length > 0) {
                let message = [];
                for (let i = 0; i < error.length; i++) {
                    message = [
                        ...message,
                        ...Object.values(error[i].constraints),
                    ];
                }
                next(new BadRequestException_1.BadRequestException(message));
            }
            else {
                next();
            }
        });
    };
}
exports.default = ValidationMiddleware;
