import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  private displayName!: string;

  @IsNotEmpty()
  @IsString()
  private username!: string;

  @IsNotEmpty()
  @IsString()
  private password!: string;

  @IsNotEmpty()
  @IsEmail()
  private email!: string;
}

export class LoginPasswordDTO {
  @IsNotEmpty()
  @IsString()
  private username!: string;

  @IsNotEmpty()
  @IsString()
  private password!: string;
}

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  private password_old!: string;

  @IsNotEmpty()
  @IsString()
  private password_new!: string;
}
