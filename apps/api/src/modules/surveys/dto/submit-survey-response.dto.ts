import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitSurveyAnswerDto {
  @IsUUID()
  questionId!: string;

  @IsOptional()
  @IsString()
  valueText?: string;

  @IsOptional()
  @IsNumber()
  valueNumber?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  selectedOptionIds?: string[];
}

export class SubmitSurveyResponseDto {
  @IsString()
  @IsNotEmpty()
  studentCode!: string;

  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @IsEmail()
  @IsNotEmpty()
  studentEmail!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitSurveyAnswerDto)
  answers!: SubmitSurveyAnswerDto[];
}
