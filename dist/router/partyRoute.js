"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// controller
const party_controller_1 = require("../function/party/party.controller");
// middleware
const checkAccessToken_middleware_1 = __importDefault(require("../middleware/checkAccessToken.middleware"));
const validation_middleware_1 = __importDefault(require("../middleware/validation.middleware"));
// dto
const party_dto_1 = require("../function/party/party.dto");
const router = express_1.default.Router();
router.post("/party", checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(party_dto_1.PartyCreateDto), party_controller_1.createParty);
router.get("/party", checkAccessToken_middleware_1.default, party_controller_1.getParties);
router.get(`/party/participation/:id`, checkAccessToken_middleware_1.default, party_controller_1.joinParty);
router.get(`/party/leaving/:id`, checkAccessToken_middleware_1.default, party_controller_1.exitParty);
router.delete(`/party/removing/:id`, checkAccessToken_middleware_1.default, party_controller_1.removeParty);
router.patch(`/party/transference-owner/:id`, checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(party_dto_1.TransferenceOwnerDTO), party_controller_1.transferenceOwner);
router.patch(`/party/expulsion/:id`, checkAccessToken_middleware_1.default, (0, validation_middleware_1.default)(party_dto_1.ExpulsionMemberDTO), party_controller_1.expulsionMemberInParty);
exports.default = router;
