var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
let SurveysModule = class SurveysModule {
};
SurveysModule = __decorate([
    Module({
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
], SurveysModule);
export { SurveysModule };
//# sourceMappingURL=surveys.module.js.map