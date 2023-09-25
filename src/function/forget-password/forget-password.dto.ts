import { IsNotEmpty, IsString, IsJWT } from "class-validator";

export class SendEmailDTO {
  @IsNotEmpty()
  @IsString()
  email!: string;
}

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  token!: string;

  @IsNotEmpty()
  @IsString()
  password_new!: string;
}
