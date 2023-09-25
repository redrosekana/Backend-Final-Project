import { Schema, model } from "mongoose";

interface BoardgameRecommend {
  game: string;
  recommend: string[];
}

const BoardgameRecommendSchema = new Schema<BoardgameRecommend>({
  game: { type: String },
  recommend: { type: [String] },
});

export const boardgameRecommendModel = model<BoardgameRecommend>(
  "boardgameRecommend",
  BoardgameRecommendSchema
);
