import mongoose, { Schema, model, Types } from "mongoose";

interface Party {
  name: string;
  limit: number;
  category: string;
  duration: number;
  place: string;
  owner: Types.ObjectId;
  member: Types.ObjectId[];
  countMember: number;
}

const partySchema = new Schema<Party>({
  name: { type: mongoose.Schema.Types.String, required: true },
  limit: {
    type: mongoose.Schema.Types.Number,
    required: true,
    min: 1,
  },
  category: { type: mongoose.Schema.Types.String, required: true },
  duration: { type: mongoose.Schema.Types.Number, required: true },
  place: { type: mongoose.Schema.Types.String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  member: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }] },
  countMember: { type: mongoose.Schema.Types.Number, required: true },
});

export const partyModel = model<Party>("party", partySchema);
