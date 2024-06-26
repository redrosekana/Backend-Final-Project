"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordDTO = exports.LoginGoogleDTO = exports.LoginPasswordDTO = exports.RegisterDTO = void 0;
const class_validator_1 = require("class-validator");
class RegisterDTO {
}
exports.RegisterDTO = RegisterDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], RegisterDTO.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], RegisterDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], RegisterDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], RegisterDTO.prototype, "email", void 0);
class LoginPasswordDTO {
}
exports.LoginPasswordDTO = LoginPasswordDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], LoginPasswordDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], LoginPasswordDTO.prototype, "password", void 0);
class LoginGoogleDTO {
}
exports.LoginGoogleDTO = LoginGoogleDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], LoginGoogleDTO.prototype, "google_token", void 0);
class UpdatePasswordDTO {
}
exports.UpdatePasswordDTO = UpdatePasswordDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], UpdatePasswordDTO.prototype, "password_old", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], UpdatePasswordDTO.prototype, "password_new", void 0);
