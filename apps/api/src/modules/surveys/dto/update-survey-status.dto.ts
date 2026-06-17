import { IsBoolean } from 'class-validator';

export class UpdateSurveyStatusDto {
  @IsBoolean()
  isActive!: boolean;
}
