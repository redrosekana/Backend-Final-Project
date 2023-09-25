import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsString()
  displayName!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;
}
