import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityRoute } from '../university-routes/university-route.entity.js';
import { QuestionOption } from './question-option.entity.js';
import { ResponseAnswer } from './response-answer.entity.js';
import { SurveyQuestion } from './survey-question.entity.js';
import { SurveyResponse } from './survey-response.entity.js';
import { Survey } from './survey.entity.js';
import { SurveysController } from './surveys.controller.js';
import { SurveysService } from './surveys.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      UniversityRoute,
      SurveyQuestion,
      QuestionOption,
      SurveyResponse,
      ResponseAnswer,
    ]),
  ],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService, TypeOrmModule],
})
export class SurveysModule {}
