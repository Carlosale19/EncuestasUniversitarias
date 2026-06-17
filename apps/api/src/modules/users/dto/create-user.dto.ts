import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user-role.enum.js';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  isActive?: boolean;
}
