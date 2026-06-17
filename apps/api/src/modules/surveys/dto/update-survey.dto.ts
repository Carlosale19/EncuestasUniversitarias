import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyDto } from './create-survey.dto.js';

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {}
