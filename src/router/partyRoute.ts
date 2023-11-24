import express, { Router } from "express";

// controller
import {
  createParty,
  getParties,
  joinParty,
  exitParty,
  removeParty,
  transferenceOwner,
  expulsionMemberInParty,
} from "../function/party/party.controller";

// middleware
import checkAccessToken from "../middleware/checkAccessToken.middleware";
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import {
  ExpulsionMemberDTO,
  PartyCreateDto,
  TransferenceOwnerDTO,
} from "../function/party/party.dto";

const router: Router = express.Router();

router.post(
  "/party",
  checkAccessToken,
  ValidationMiddleware(PartyCreateDto),
  createParty
);

router.get("/party", checkAccessToken, getParties);
router.get(`/party/participation/:id`, checkAccessToken, joinParty);
router.get(`/party/leaving/:id`, checkAccessToken, exitParty);
router.delete(`/party/removing/:id`, checkAccessToken, removeParty);
router.patch(
  `/party/transference-owner/:id`,
  checkAccessToken,
  ValidationMiddleware(TransferenceOwnerDTO),
  transferenceOwner
);
router.patch(
  `/party/expulsion/:id`,
  checkAccessToken,
  ValidationMiddleware(ExpulsionMemberDTO),
  expulsionMemberInParty
);

export default router;
