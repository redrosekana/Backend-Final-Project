"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expulsionMemberInParty = exports.transferenceOwner = exports.removeParty = exports.exitParty = exports.joinParty = exports.getParties = exports.createParty = void 0;
// exception
const BadRequestException_1 = require("../../exeptions/BadRequestException");
// model
const user_schema_1 = require("../../schema/user.schema");
const party_schema_1 = require("../../schema/party.schema");
// utils
const calculatePaginate_1 = require("../../utils/calculatePaginate");
function createParty(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, provider } = req.payload;
            const user = yield user_schema_1.userModel
                .findOne({ email, provider })
                .select("-password -__v");
            if (req.body.limit < 1) {
                next(new BadRequestException_1.BadRequestException("limit must be greater than 1"));
            }
            else if ((user === null || user === void 0 ? void 0 : user.ownerParty) || (user === null || user === void 0 ? void 0 : user.memberParty)) {
                next(new BadRequestException_1.BadRequestException("you can't create a party because you already have a party"));
            }
            else {
                // remain check element inside category
                const body = Object.assign(Object.assign({}, req.body), { owner: user === null || user === void 0 ? void 0 : user._id, member: [user === null || user === void 0 ? void 0 : user._id], countMember: 1 });
                const party = yield party_schema_1.partyModel.create(body);
                yield user_schema_1.userModel.findOneAndUpdate({
                    email,
                    provider,
                }, {
                    $set: { ownerParty: party._id, memberParty: party._id },
                });
                res.status(201).json({
                    statusCode: 201,
                    message: "successfully created",
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.createParty = createParty;
function getParties(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const limit = parseInt(req.query.limit) || 3;
            const page = parseInt(req.query.page) || 1;
            const search = req.query.search || "";
            const regex = new RegExp(search, "ig");
            const totalDocs = yield party_schema_1.partyModel
                .find({ name: { $regex: regex } })
                .countDocuments();
            const totalPages = (0, calculatePaginate_1.getTotalPages)(limit, totalDocs);
            const parties = yield party_schema_1.partyModel
                .find({ name: { $regex: regex } })
                .select("-__v")
                .skip((0, calculatePaginate_1.skipDocuments)(limit, page))
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
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.getParties = getParties;
function joinParty(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, provider } = req.payload;
            const { id } = req.params;
            const user = yield user_schema_1.userModel
                .findOne({ email, provider })
                .select("-password -__v");
            const currentParty = yield party_schema_1.partyModel.findById(id);
            if (!currentParty) {
                next(new BadRequestException_1.BadRequestException("there isn't a party in the system"));
            }
            else if ((user === null || user === void 0 ? void 0 : user.ownerParty) || (user === null || user === void 0 ? void 0 : user.memberParty)) {
                next(new BadRequestException_1.BadRequestException("you can't join this party because you already have a party"));
            }
            else {
                const canJoinParty = currentParty.limit - currentParty.countMember > 0;
                if (!canJoinParty) {
                    next(new BadRequestException_1.BadRequestException("the number of people in the group is full"));
                }
                else {
                    const party = yield party_schema_1.partyModel.findByIdAndUpdate(id, {
                        $push: { member: user === null || user === void 0 ? void 0 : user._id },
                        $inc: { countMember: 1 },
                    });
                    yield user_schema_1.userModel.findOneAndUpdate({ email, provider }, { $set: { memberParty: party === null || party === void 0 ? void 0 : party._id } });
                    res.status(200).json({
                        statusCode: 200,
                        message: "successfully joined party",
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.joinParty = joinParty;
function exitParty(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, provider } = req.payload;
            const { id } = req.params;
            const user = yield user_schema_1.userModel
                .findOne({ email, provider })
                .select("-password -__v");
            const currentParty = yield party_schema_1.partyModel.findById(id);
            if (!currentParty) {
                next(new BadRequestException_1.BadRequestException("there isn't a party in the system"));
            }
            else if (String(user === null || user === void 0 ? void 0 : user.memberParty) !== String(currentParty === null || currentParty === void 0 ? void 0 : currentParty._id)) {
                next(new BadRequestException_1.BadRequestException("you aren't at the party"));
            }
            else if (user === null || user === void 0 ? void 0 : user.ownerParty) {
                next(new BadRequestException_1.BadRequestException("you are the owner of party so you can't leave party"));
            }
            else {
                const members = currentParty.member.filter((member) => {
                    return String(member._id) !== String(user === null || user === void 0 ? void 0 : user.id);
                });
                yield party_schema_1.partyModel.findByIdAndUpdate(id, {
                    $set: { member: members },
                    $inc: { countMember: -1 },
                });
                yield user_schema_1.userModel.findOneAndUpdate({ email, provider }, { $unset: { memberParty: "" } });
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully leaving party",
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.exitParty = exitParty;
function removeParty(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, provider } = req.payload;
            const { id } = req.params;
            const user = yield user_schema_1.userModel
                .findOne({ email, provider })
                .select("-password -__v");
            const currentParty = yield party_schema_1.partyModel.findById(id);
            if (!currentParty) {
                next(new BadRequestException_1.BadRequestException("there isn't a party in the system"));
            }
            else if (String(user === null || user === void 0 ? void 0 : user.ownerParty) !== id) {
                next(new BadRequestException_1.BadRequestException("you aren't the owner of group"));
            }
            else {
                yield party_schema_1.partyModel.findByIdAndDelete(id);
                yield user_schema_1.userModel.findOneAndUpdate({ ownerParty: id }, { $unset: { ownerParty: "" } });
                yield user_schema_1.userModel.updateMany({ memberParty: id }, { $unset: { memberParty: "" } });
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully removed party",
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.removeParty = removeParty;
function transferenceOwner(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, provider } = req.payload;
            const { id } = req.params;
            const user_id = req.body.user_id.trim();
            const currentUser = yield user_schema_1.userModel.findOne({
                email: { $eq: email },
                provider: { $eq: provider },
            });
            const currentParty = yield party_schema_1.partyModel.findById(id);
            const nextMemberOwner = yield user_schema_1.userModel.findById(user_id);
            if (String(currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) !== String(currentParty === null || currentParty === void 0 ? void 0 : currentParty.owner)) {
                next(new BadRequestException_1.BadRequestException("you aren't a owner of party"));
            }
            else if (!nextMemberOwner) {
                next(new BadRequestException_1.BadRequestException("there isn't a user in system"));
            }
            else if (!(currentParty === null || currentParty === void 0 ? void 0 : currentParty.member.includes(nextMemberOwner._id))) {
                next(new BadRequestException_1.BadRequestException("there isn't a user in party"));
            }
            else if (String(currentParty.owner) === String(nextMemberOwner._id)) {
                next(new BadRequestException_1.BadRequestException("you are owner so you can't transfer the owner yourself"));
            }
            else {
                yield user_schema_1.userModel.findOneAndUpdate({
                    email: { $eq: email },
                    provider: { $eq: provider },
                }, {
                    $unset: { ownerParty: "" },
                });
                yield party_schema_1.partyModel.findByIdAndUpdate(id, {
                    $set: { owner: nextMemberOwner._id },
                });
                yield user_schema_1.userModel.findByIdAndUpdate(user_id, {
                    $set: { ownerParty: currentParty._id },
                });
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully transfer owner",
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.transferenceOwner = transferenceOwner;
function expulsionMemberInParty(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, provider } = req.payload;
            const { id } = req.params;
            const user_id = req.body.user_id.trim();
            const currentUser = yield user_schema_1.userModel.findOne({
                email: { $eq: email },
                provider: { $eq: provider },
            });
            const expulsionMember = yield user_schema_1.userModel.findById(user_id);
            const currentParty = yield party_schema_1.partyModel.findById(id);
            if (String(currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) !== String(currentParty === null || currentParty === void 0 ? void 0 : currentParty.owner)) {
                next(new BadRequestException_1.BadRequestException("you aren't a owner of party"));
            }
            else if (!expulsionMember) {
                next(new BadRequestException_1.BadRequestException("there isn't a user in system"));
            }
            else if (!(currentParty === null || currentParty === void 0 ? void 0 : currentParty.member.includes(expulsionMember._id))) {
                next(new BadRequestException_1.BadRequestException("there isn't a user in party"));
            }
            else if (String(currentParty.owner) === String(expulsionMember._id)) {
                next(new BadRequestException_1.BadRequestException("you are owner so you can't fire yourself"));
            }
            else {
                const filterMember = currentParty.member.filter((member) => String(member) !== (expulsionMember === null || expulsionMember === void 0 ? void 0 : expulsionMember.id));
                yield party_schema_1.partyModel.findByIdAndUpdate(id, {
                    $inc: { countMember: -1 },
                    $set: { member: filterMember },
                });
                yield user_schema_1.userModel.findByIdAndUpdate(expulsionMember === null || expulsionMember === void 0 ? void 0 : expulsionMember.id, {
                    $unset: { memberParty: "" },
                });
                res.status(200).json({
                    statusCode: 200,
                    message: "successfully fired a member",
                });
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
exports.expulsionMemberInParty = expulsionMemberInParty;
