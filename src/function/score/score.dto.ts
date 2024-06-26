import { IsNotEmpty, IsString, IsNumber } from "class-validator";
import "reflect-metadata";

export class ScoreBoardgameDTO {
  @IsNotEmpty()
  @IsString()
  "name": string;

  @IsNotEmpty()
  @IsNumber()
  "score": number;
}

// export class ScoreBoardgameDTO {
//   @IsArray()
//   @IsNotEmpty()
//   @ValidateNested({ each: true })
//   @Type(() => ScoreEntriesDTO)
//   "score_entries": ScoreEntriesDTO[];
// }
