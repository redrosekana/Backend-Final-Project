"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const party_controller_1 = __importDefault(require("../function/party/party.controller"));
// middleware
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const party_dto_1 = __importDefault(require("../function/party/party.dto"));
class PartyRoute {
    constructor() {
        this.router = express_1.default.Router();
        this.path = "/party";
        this.partyController = new party_controller_1.default();
        this.initialRoutes();
    }
    initialRoutes() {
        this.router.post(this.path, checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(party_dto_1.default), this.partyController.createParty);
        this.router.get(this.path, checkAccessToken_middleware_1.default, this.partyController.getParties);
        this.router.get(`${this.path}/participation/:id`, checkAccessToken_middleware_1.default, this.partyController.joinParty);
        this.router.get(`${this.path}/leaving/:id`, checkAccessToken_middleware_1.default, this.partyController.exitParty);
        this.router.delete(`${this.path}/removing/:id`, checkAccessToken_middleware_1.default, this.partyController.removeParty);
    }
}
exports.default = PartyRoute;
