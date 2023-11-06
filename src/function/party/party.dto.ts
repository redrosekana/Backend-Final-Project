import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class PartyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  limit!: number;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsNotEmpty()
  @IsString()
  place!: string;
}
