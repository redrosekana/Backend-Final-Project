import { Schema, model } from "mongoose";

interface User {
  displayName?: string;
  username?: string;
  password?: string;
  email?: string;
  lat?: string;
  lon?: string;
  provider: string;
}

const userSchema = new Schema<User>({
  displayName: { type: String },
  username: { type: String },
  password: { type: String },
  email: { type: String },
  lat: { type: String },
  lon: { type: String },
  provider: {
    type: String,
    required: true,
    enum: ["password", "google", "github"],
  },
});

export const userModel = model<User>("user", userSchema);
