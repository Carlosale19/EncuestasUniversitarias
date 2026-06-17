import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user-role.enum.js';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
