import mongoose, { Schema, model, Types } from "mongoose";

interface User {
  displayName?: string;
  username?: string;
  password?: string;
  email?: string;
  urlAvatar?: string;
  provider: string;
  ownerParty?: Types.ObjectId;
  memberParty?: Types.ObjectId;
  scoring: Types.ObjectId;
}

const userSchema = new Schema<User>({
  displayName: { type: mongoose.Schema.Types.String },
  username: { type: mongoose.Schema.Types.String },
  password: { type: mongoose.Schema.Types.String },
  email: { type: mongoose.Schema.Types.String },
  urlAvatar: { type: mongoose.Schema.Types.String },
  provider: {
    type: mongoose.Schema.Types.String,
    required: true,
    enum: ["password", "google", "github"],
  },
  ownerParty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "party",
  },
  memberParty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "party",
  },
  scoring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "score",
  },
});

export const userModel = model<User>("user", userSchema);
