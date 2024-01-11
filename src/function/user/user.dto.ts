import {
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
  IsNotEmpty,
} from "class-validator";

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  "displayName": string;

  @IsOptional()
  @IsString()
  "username": string;
}

export class ChangeAvatarDTO {
  @IsUrl()
  "url": string;
}

export class RemoveScoreBoardgameDTO {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  "scoreBoardgameNameEntries": string[];
}
