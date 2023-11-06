import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  displayName!: string;

  @IsOptional()
  @IsString()
  username!: string;
}

export class ChangeAvatarDTO {
  @IsUrl()
  url!: string;
}
