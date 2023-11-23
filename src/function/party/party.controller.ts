import { Request, Response, NextFunction } from "express";
import { ObjectId, Types } from "mongoose";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

// model
import { userModel } from "../../schema/user.schema";
import { partyModel } from "../../schema/party.schema";

// utils
import { getTotalPages, skipDocuments } from "../../utils/calculatePaginate";

async function createParty(req: Request, res: Response, next: NextFunction) {
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
      // remain check element inside category

      const body = {
        ...req.body,
        owner: user?._id,
        member: [user?._id],
        countMember: 1,
      };

      console.log(body);

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

async function getParties(req: Request, res: Response, next: NextFunction) {
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

async function joinParty(req: Request, res: Response, next: NextFunction) {
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
async function exitParty(req: Request, res: Response, next: NextFunction) {
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

async function removeParty(req: Request, res: Response, next: NextFunction) {
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

async function transferenceOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, provider } = req.payload;
    const { id } = req.params;
    const user_id = (req.body.user_id as string).trim();

    const currentUser = await userModel.findOne({
      email: { $eq: email },
      provider: { $eq: provider },
    });
    const currentParty = await partyModel.findById(id);
    const nextMemberOwner = await userModel.findById(user_id);

    if (String(currentUser?._id) !== String(currentParty?.owner)) {
      next(new BadRequestException("you aren't a owner of party"));
    } else if (!nextMemberOwner) {
      next(new BadRequestException("there isn't a user in system"));
    } else if (!currentParty?.member.includes(nextMemberOwner._id)) {
      next(new BadRequestException("there isn't a user in party"));
    } else if (String(currentParty.owner) === String(nextMemberOwner._id)) {
      next(
        new BadRequestException(
          "you are owner so you can't transfer the owner yourself"
        )
      );
    } else if (true) {
      await userModel.findOneAndUpdate(
        {
          email: { $eq: email },
          provider: { $eq: provider },
        },
        {
          $unset: { ownerParty: "" },
        }
      );

      await partyModel.findByIdAndUpdate(id, {
        $set: { owner: nextMemberOwner._id },
      });

      await userModel.findByIdAndUpdate(user_id, {
        $set: { ownerParty: currentParty._id },
      });

      res.status(200).json({
        statusCode: 200,
        message: "successfully transfer owner",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function expulsionMemberInParty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, provider } = req.payload;
    const { id } = req.params;
    const user_id = (req.body.user_id as string).trim();

    const currentUser = await userModel.findOne({
      email: { $eq: email },
      provider: { $eq: provider },
    });
    const expulsionMember = await userModel.findById(user_id);
    const currentParty = await partyModel.findById(id);

    if (String(currentUser?._id) !== String(currentParty?.owner)) {
      next(new BadRequestException("you aren't a owner of party"));
    } else if (!expulsionMember) {
      next(new BadRequestException("there isn't a user in system"));
    } else if (!currentParty?.member.includes(expulsionMember._id)) {
      next(new BadRequestException("there isn't a user in party"));
    } else if (String(currentParty.owner) === String(expulsionMember._id)) {
      next(new BadRequestException("you are owner so you can't fire yourself"));
    } else {
      const filterMember: Types.ObjectId[] = currentParty.member.filter(
        (member) => String(member) !== expulsionMember?.id
      );

      await partyModel.findByIdAndUpdate(id, {
        $inc: { countMember: -1 },
        $set: { member: filterMember },
      });

      await userModel.findByIdAndUpdate(expulsionMember?.id, {
        $unset: { memberParty: "" },
      });

      res.status(200).json({
        statusCode: 200,
        message: "successfully fired a member",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export {
  createParty,
  getParties,
  joinParty,
  exitParty,
  removeParty,
  transferenceOwner,
  expulsionMemberInParty,
};
