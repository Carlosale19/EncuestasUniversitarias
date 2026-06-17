import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { ResponseAnswer } from './modules/surveys/response-answer.entity.js';
import { QuestionOption } from './modules/surveys/question-option.entity.js';
import { SurveyQuestion } from './modules/surveys/survey-question.entity.js';
import { SurveyResponse } from './modules/surveys/survey-response.entity.js';
import { Survey } from './modules/surveys/survey.entity.js';
import { SurveysModule } from './modules/surveys/surveys.module.js';
import { UniversityRoute } from './modules/university-routes/university-route.entity.js';
import { UniversityRoutesModule } from './modules/university-routes/university-routes.module.js';
import { User } from './modules/users/user.entity.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'encuestas_universitarias',
      synchronize: (process.env.DB_SYNC ?? 'true') === 'true',
      entities: [
        User,
        UniversityRoute,
        Survey,
        SurveyQuestion,
        QuestionOption,
        SurveyResponse,
        ResponseAnswer,
      ],
    }),
    AuthModule,
    UsersModule,
    UniversityRoutesModule,
    SurveysModule,
    DashboardModule,
  ],
})
export class AppModule {}
