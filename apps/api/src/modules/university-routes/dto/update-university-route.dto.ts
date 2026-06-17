import { IsOptional, IsString } from 'class-validator';

export class UpdateUniversityRouteDto {
  @IsOptional()
  @IsString()
  nombreRuta?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
