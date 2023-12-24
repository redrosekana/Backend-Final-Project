import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";

export class ScoreBoardgameDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;
}
