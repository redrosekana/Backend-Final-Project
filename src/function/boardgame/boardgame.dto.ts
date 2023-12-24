import { IsNotEmpty, IsString, IsArray, IsOptional } from "class-validator";

export class BoardgameRecommendGuessDTO {
  @IsNotEmpty()
  @IsString()
  boardgame_name!: string;
}

export class BoardgameRecommendAuthDTO {
  @IsOptional()
  @IsString()
  time!: string;

  @IsOptional()
  @IsString()
  weight!: string;

  @IsOptional()
  @IsString()
  players!: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  category!: string[];
}
