import { IsOptional, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  displayName!: string;

  @IsOptional()
  @IsString()
  username!: string;
}
