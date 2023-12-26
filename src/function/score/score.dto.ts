import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import "reflect-metadata";

class ScoreEntriesDTO {
  @IsNotEmpty()
  @IsString()
  "name": string;

  @IsNotEmpty()
  @IsNumber()
  "score": number;
}

export class ScoreBoardgameDTO {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ScoreEntriesDTO)
  "score_entries": ScoreEntriesDTO[];
}
