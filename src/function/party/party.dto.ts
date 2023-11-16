import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
} from "class-validator";

export class PartyCreateDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  limit!: number;

  @IsOptional()
  @IsArray()
  category!: string[];

  @IsNotEmpty()
  @IsString()
  place!: string;

  @IsOptional()
  @IsString()
  description!: string;
}

export class ExpulsionMemberDTO {
  @IsNotEmpty()
  @IsString()
  "user_id"!: string;
}

export class TransferenceOwnerDTO {
  @IsNotEmpty()
  @IsString()
  "user_id"!: string;
}
