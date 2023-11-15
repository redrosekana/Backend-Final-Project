"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeAvatarDTO = exports.UpdateUserDTO = void 0;
const class_validator_1 = require("class-validator");
class UpdateUserDTO {
}
exports.UpdateUserDTO = UpdateUserDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], UpdateUserDTO.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], UpdateUserDTO.prototype, "username", void 0);
class ChangeAvatarDTO {
}
exports.ChangeAvatarDTO = ChangeAvatarDTO;
__decorate([
    (0, class_validator_1.IsUrl)()
], ChangeAvatarDTO.prototype, "url", void 0);
