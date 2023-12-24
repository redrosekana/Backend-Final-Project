import mongoose, { Schema, model } from "mongoose";

interface Score {
  scoreEntries: SorceEntries[];
}

interface SorceEntries {
  name: string;
  score: number;
}

const scoreSchema = new Schema<Score>({
  scoreEntries: {
    type: [
      {
        name: { type: mongoose.Schema.Types.String, require: true },
        score: { type: mongoose.Schema.Types.Number, require: true },
      },
    ],
    default: [],
  },
});

export const scoreModel = model<Score>("score", scoreSchema);
