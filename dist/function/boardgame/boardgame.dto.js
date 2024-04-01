"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardgameRecommendAuthDTO = exports.BoardgameRecommendGuessDTO = void 0;
const class_validator_1 = require("class-validator");
class BoardgameRecommendGuessDTO {
}
exports.BoardgameRecommendGuessDTO = BoardgameRecommendGuessDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], BoardgameRecommendGuessDTO.prototype, "boardgame_name", void 0);
class BoardgameRecommendAuthDTO {
}
exports.BoardgameRecommendAuthDTO = BoardgameRecommendAuthDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], BoardgameRecommendAuthDTO.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], BoardgameRecommendAuthDTO.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], BoardgameRecommendAuthDTO.prototype, "players", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsArray)()
], BoardgameRecommendAuthDTO.prototype, "category", void 0);
