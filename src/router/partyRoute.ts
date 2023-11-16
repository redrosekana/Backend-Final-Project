import express, { Router } from "express";

// controller
import PartyController from "../function/party/party.controller";

// middleware
import checkAccessToken from "../middleware/checkAccessToken.middleware";
import ValidationMiddleware from "../middleware/validation.middleware";

// dto
import {
  ExpulsionMemberDTO,
  PartyCreateDto,
  TransferenceOwnerDTO,
} from "../function/party/party.dto";

class PartyRoute {
  public router: Router;
  private path: string;
  private partyController: PartyController;

  constructor() {
    this.router = express.Router();
    this.path = "/party";
    this.partyController = new PartyController();

    this.initialRoutes();
  }

  private initialRoutes() {
    this.router.post(
      this.path,
      checkAccessToken,
      ValidationMiddleware(PartyCreateDto),
      this.partyController.createParty
    );

    this.router.get(
      this.path,
      checkAccessToken,
      this.partyController.getParties
    );

    this.router.get(
      `${this.path}/participation/:id`,
      checkAccessToken,
      this.partyController.joinParty
    );

    this.router.get(
      `${this.path}/leaving/:id`,
      checkAccessToken,
      this.partyController.exitParty
    );

    this.router.delete(
      `${this.path}/removing/:id`,
      checkAccessToken,
      this.partyController.removeParty
    );

    this.router.patch(
      `${this.path}/transference-owner/:id`,
      checkAccessToken,
      ValidationMiddleware(TransferenceOwnerDTO),
      this.partyController.transferenceOwner
    );

    this.router.patch(
      `${this.path}/expulsion/:id`,
      checkAccessToken,
      ValidationMiddleware(ExpulsionMemberDTO),
      this.partyController.ExpulsionMemberInParty
    );
  }
}

export default PartyRoute;
