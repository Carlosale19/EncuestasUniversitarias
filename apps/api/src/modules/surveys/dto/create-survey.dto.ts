import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../question-type.enum.js';

export class CreateQuestionOptionDto {
  @IsString()
  etiqueta!: string;

  @IsString()
  valor!: string;

  @IsInt()
  @Min(1)
  orden!: number;
}

export class CreateSurveyQuestionDto {
  @IsString()
  titulo!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsEnum(QuestionType)
  tipo!: QuestionType;

  @IsBoolean()
  requerida!: boolean;

  @IsInt()
  @Min(1)
  orden!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options?: CreateQuestionOptionDto[];
}

export class CreateSurveyDto {
  @IsUUID()
  routeId!: string;

  @IsString()
  titulo!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsBoolean()
  isActive!: boolean;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSurveyQuestionDto)
  questions!: CreateSurveyQuestionDto[];
}
