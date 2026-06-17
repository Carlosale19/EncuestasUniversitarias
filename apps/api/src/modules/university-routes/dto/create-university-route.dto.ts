import { IsOptional, IsString } from 'class-validator';

export class CreateUniversityRouteDto {
  @IsString()
  nombreRuta!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
