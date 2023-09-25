import { IsNotEmpty, IsString } from "class-validator";

export class BoardgameRecommendGuessDTO {
  @IsNotEmpty()
  @IsString()
  private boardgame_name!: string;
}
