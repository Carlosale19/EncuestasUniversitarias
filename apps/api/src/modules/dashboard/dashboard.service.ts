import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionType } from '../surveys/question-type.enum.js';
import { Survey } from '../surveys/survey.entity.js';
import { buildDashboardOverview } from './dashboard.utils.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveysRepository: Repository<Survey>,
  ) {}

  async getOverview() {
    const surveys = await this.surveysRepository.find({
      relations: {
        route: true,
        responses: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return buildDashboardOverview(surveys);
  }

  async getSurveyResults(surveyId: string) {
    const survey = await this.surveysRepository.findOne({
      where: { id: surveyId },
      relations: {
        route: true,
        questions: { options: true, answers: { selectedOptions: true } },
        responses: { answers: { question: true, selectedOptions: true } },
      },
    });

    if (!survey) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    const analytics = survey.questions
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((question) => {
        const questionAnswers = survey.responses.flatMap((response) =>
          response.answers.filter((answer) => answer.questionId === question.id),
        );

        if (
          question.questionType === QuestionType.SINGLE_CHOICE ||
          question.questionType === QuestionType.MULTIPLE_CHOICE
        ) {
          const options = question.options
            .slice()
            .sort((a, b) => a.orden - b.orden)
            .map((option) => ({
              optionId: option.id,
              label: option.etiqueta,
              value: option.valor,
              count: questionAnswers.filter((answer) =>
                answer.selectedOptions.some((selected) => selected.id === option.id),
              ).length,
            }));

          return {
            questionId: question.id,
            title: question.titulo,
            type: question.questionType,
            totalAnswers: questionAnswers.length,
            options,
          };
        }

        if (
          question.questionType === QuestionType.NUMBER ||
          question.questionType === QuestionType.RATING
        ) {
          const numbers = questionAnswers
            .map((answer) => answer.valueNumber)
            .filter((value): value is number => value !== null && value !== undefined)
            .map((value) => Number(value));

          const average =
            numbers.length > 0
              ? numbers.reduce((total, value) => total + value, 0) / numbers.length
              : 0;

          return {
            questionId: question.id,
            title: question.titulo,
            type: question.questionType,
            totalAnswers: numbers.length,
            average: Number(average.toFixed(2)),
            values: numbers,
          };
        }

        return {
          questionId: question.id,
          title: question.titulo,
          type: question.questionType,
          totalAnswers: questionAnswers.length,
          responses: questionAnswers.map((answer) => answer.valueText ?? '').filter(Boolean),
        };
      });

    const records = survey.responses.map((response) => ({
      id: response.id,
      studentCode: response.studentCode,
      studentName: response.studentName,
      studentEmail: response.studentEmail,
      submittedAt: response.submittedAt.toISOString(),
      answers: response.answers
        .slice()
        .sort((a, b) => {
          const questionA = survey.questions.find((question) => question.id === a.questionId);
          const questionB = survey.questions.find((question) => question.id === b.questionId);
          return (questionA?.orden ?? 0) - (questionB?.orden ?? 0);
        })
        .map((answer) => ({
          questionId: answer.questionId,
          questionTitle:
            survey.questions.find((question) => question.id === answer.questionId)?.titulo ?? '',
          value:
            answer.selectedOptions.length > 0
              ? answer.selectedOptions.map((option) => option.etiqueta).join(', ')
              : answer.valueText ?? answer.valueNumber ?? '',
        })),
    }));

    return {
      survey: {
        id: survey.id,
        titulo: survey.titulo,
        descripcion: survey.descripcion,
        publicSlug: survey.publicSlug,
        isActive: survey.isActive,
        routeName: survey.route.nombreRuta,
        responsesCount: survey.responses.length,
      },
      analytics,
      records,
    };
  }
}
