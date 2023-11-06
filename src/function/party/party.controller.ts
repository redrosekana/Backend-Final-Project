import { Request, Response, NextFunction } from "express";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

// model
import { userModel } from "../../schema/user.schema";
import { partyModel } from "../../schema/party.schema";

// utils
import { getTotalPages, skipDocuments } from "../../utils/calculatePaginate";

class PartyController {
  public async createParty(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, provider } = req.payload;

      const user = await userModel
        .findOne({ email, provider })
        .select("-password -__v");

      if (req.body.limit < 1) {
        next(new BadRequestException("limit must be greater than 1"));
      } else if (user?.ownerParty || user?.memberParty) {
        next(
          new BadRequestException(
            "you can't create a party because you already have a party"
          )
        );
      } else {
        const body = {
          ...req.body,
          owner: user?._id,
          member: [user?._id],
          countMember: 1,
        };

        const party = await partyModel.create(body);
        await userModel.findOneAndUpdate(
          {
            email,
            provider,
          },
          {
            $set: { ownerParty: party._id, memberParty: party._id },
          }
        );

        res.status(201).json({
          statusCode: 201,
          message: "successfully created",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async getParties(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const page = parseInt(req.query.page as string) || 1;

      const search = req.query.search || "";
      const regex = new RegExp(search as string, "ig");

      const totalDocs = await partyModel
        .find({ name: { $regex: regex } })
        .countDocuments();
      const totalPages = getTotalPages(limit, totalDocs);

      const parties = await partyModel
        .find({ name: { $regex: regex } })
        .select("-__v")
        .skip(skipDocuments(limit, page))
        .limit(limit)
        .populate({
          path: "owner",
          select: "-password -__v -ownerParty -memberParty",
        })
        .populate({
          path: "member",
          select: "-password -__v -ownerParty -memberParty",
        });

      res.status(200).json({
        statusCode: 200,
        message: "successfully findAll Parties",
        data: {
          information: {
            totalPages: totalPages,
            totalDocs: totalDocs,
            amountOfCurrentDoc: parties.length,
            previousPage: page > 1 && page <= totalPages ? page - 1 : null,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
          },
          parties: parties,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async joinParty(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, provider } = req.payload;
      const { id } = req.params;

      const user = await userModel
        .findOne({ email, provider })
        .select("-password -__v");

      const currentParty = await partyModel.findById(id);

      if (!currentParty) {
        next(new BadRequestException("there isn't a party in the system"));
      } else if (user?.ownerParty || user?.memberParty) {
        next(
          new BadRequestException(
            "you can't join this party because you already have a party"
          )
        );
      } else {
        const canJoinParty = currentParty.limit - currentParty.countMember > 0;

        if (!canJoinParty) {
          next(
            new BadRequestException("the number of people in the group is full")
          );
        } else {
          const party = await partyModel.findByIdAndUpdate(id, {
            $push: { member: user?._id },
            $inc: { countMember: 1 },
          });

          await userModel.findOneAndUpdate(
            { email, provider },
            { $set: { memberParty: party?._id } }
          );

          res.status(200).json({
            statusCode: 200,
            message: "successfully joined party",
          });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  public async exitParty(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, provider } = req.payload;
      const { id } = req.params;

      const user = await userModel
        .findOne({ email, provider })
        .select("-password -__v");

      const currentParty = await partyModel.findById(id);

      if (!currentParty) {
        next(new BadRequestException("there isn't a party in the system"));
      } else if (String(user?.memberParty) !== String(currentParty?._id)) {
        next(new BadRequestException("you aren't at the party"));
      } else if (user?.ownerParty) {
        next(
          new BadRequestException(
            "you are the owner of party so you can't leave party"
          )
        );
      } else {
        const members = currentParty.member.filter((member) => {
          return String(member._id) !== String(user?.id);
        });

        await partyModel.findByIdAndUpdate(id, {
          $set: { member: members },
          $inc: { countMember: -1 },
        });

        await userModel.findOneAndUpdate(
          { email, provider },
          { $unset: { memberParty: "" } }
        );
        res.status(200).json({
          statusCode: 200,
          message: "successfully leaving party",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  public async removeParty(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, provider } = req.payload;
      const { id } = req.params;

      const user = await userModel
        .findOne({ email, provider })
        .select("-password -__v");

      const currentParty = await partyModel.findById(id);

      if (!currentParty) {
        next(new BadRequestException("there isn't a party in the system"));
      } else if (String(user?.ownerParty) !== id) {
        next(new BadRequestException("you aren't the owner of group"));
      } else {
        await partyModel.findByIdAndDelete(id);
        await userModel.findOneAndUpdate(
          { ownerParty: id },
          { $unset: { ownerParty: "" } }
        );
        await userModel.updateMany(
          { memberParty: id },
          { $unset: { memberParty: "" } }
        );

        res.status(200).json({
          statusCode: 200,
          message: "successfully removed party",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default PartyController;
