import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { UniversityRoute } from '../university-routes/university-route.entity.js';
import { CreateSurveyDto, CreateSurveyQuestionDto } from './dto/create-survey.dto.js';
import { SubmitSurveyResponseDto } from './dto/submit-survey-response.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import { QuestionOption } from './question-option.entity.js';
import { QuestionType } from './question-type.enum.js';
import { ResponseAnswer } from './response-answer.entity.js';
import { SurveyQuestion } from './survey-question.entity.js';
import { SurveyResponse } from './survey-response.entity.js';
import { Survey } from './survey.entity.js';

type RequestMeta = {
  ipAddress?: string;
  userAgent?: string;
};

@Injectable()
export class SurveysService {
  constructor(
    @Inject(DataSource)
    private readonly dataSource: DataSource,
    @InjectRepository(Survey)
    private readonly surveysRepository: Repository<Survey>,
    @InjectRepository(UniversityRoute)
    private readonly routesRepository: Repository<UniversityRoute>,
    @InjectRepository(SurveyQuestion)
    private readonly questionsRepository: Repository<SurveyQuestion>,
    @InjectRepository(QuestionOption)
    private readonly optionsRepository: Repository<QuestionOption>,
    @InjectRepository(SurveyResponse)
    private readonly responsesRepository: Repository<SurveyResponse>,
    @InjectRepository(ResponseAnswer)
    private readonly answersRepository: Repository<ResponseAnswer>,
  ) {}

  async findAll() {
    const surveys = await this.surveysRepository.find({
      relations: {
        route: true,
        questions: true,
        responses: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return surveys.map((survey) => this.mapSurveySummary(survey));
  }

  async findOneAdmin(id: string) {
    const survey = await this.surveysRepository.findOne({
      where: { id },
      relations: {
        route: true,
        questions: { options: true },
      },
    });

    if (!survey) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    return this.mapSurveyDetail(survey);
  }

  async findPublicBySlug(publicSlug: string) {
    const survey = await this.surveysRepository.findOne({
      where: { publicSlug, isActive: true },
      relations: {
        route: true,
        questions: { options: true },
      },
    });

    if (!survey || !this.isSurveyAvailable(survey)) {
      throw new NotFoundException('Encuesta publica no disponible');
    }

    return this.mapSurveyPublic(survey);
  }

  async create(dto: CreateSurveyDto, createdById: string) {
    const route = await this.routesRepository.findOne({ where: { id: dto.routeId } });
    if (!route) {
      throw new BadRequestException('La ruta indicada no existe');
    }

    return this.dataSource.transaction(async (manager) => {
      const surveyRepo = manager.getRepository(Survey);
      const survey = surveyRepo.create({
        routeId: dto.routeId,
        createdById,
        titulo: dto.titulo,
        descripcion: dto.descripcion ?? null,
        publicSlug: this.buildPublicSlug(dto.titulo),
        isActive: dto.isActive,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      });

      const savedSurvey = await surveyRepo.save(survey);
      await this.saveQuestions(manager, savedSurvey.id, dto.questions);

      const fullSurvey = await surveyRepo.findOneOrFail({
        where: { id: savedSurvey.id },
        relations: {
          route: true,
          questions: { options: true },
          responses: true,
        },
      });

      return this.mapSurveySummary(fullSurvey);
    });
  }

  async update(id: string, dto: UpdateSurveyDto) {
    const survey = await this.surveysRepository.findOne({
      where: { id },
      relations: {
        questions: { options: true },
      },
    });

    if (!survey) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    if (dto.routeId) {
      const route = await this.routesRepository.findOne({ where: { id: dto.routeId } });
      if (!route) {
        throw new BadRequestException('La ruta indicada no existe');
      }
      survey.routeId = dto.routeId;
    }

    if (dto.titulo !== undefined) {
      survey.titulo = dto.titulo;
      survey.publicSlug = this.buildPublicSlug(dto.titulo, survey.id);
    }
    if (dto.descripcion !== undefined) {
      survey.descripcion = dto.descripcion ?? null;
    }
    if (dto.isActive !== undefined) {
      survey.isActive = dto.isActive;
    }
    if (dto.startsAt !== undefined) {
      survey.startsAt = dto.startsAt ? new Date(dto.startsAt) : null;
    }
    if (dto.endsAt !== undefined) {
      survey.endsAt = dto.endsAt ? new Date(dto.endsAt) : null;
    }

    return this.dataSource.transaction(async (manager) => {
      const surveyRepo = manager.getRepository(Survey);
      const questionRepo = manager.getRepository(SurveyQuestion);

      await surveyRepo.save(survey);

      if (survey.questions.length > 0) {
        await questionRepo.remove(survey.questions);
      }

      if (dto.questions && dto.questions.length > 0) {
        await this.saveQuestions(manager, survey.id, dto.questions);
      }

      const fullSurvey = await surveyRepo.findOneOrFail({
        where: { id: survey.id },
        relations: {
          route: true,
          questions: { options: true },
          responses: true,
        },
      });

      return this.mapSurveySummary(fullSurvey);
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    const survey = await this.surveysRepository.findOne({ where: { id } });
    if (!survey) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    survey.isActive = isActive;
    return this.surveysRepository.save(survey);
  }

  async remove(id: string) {
    const survey = await this.surveysRepository.findOne({ where: { id } });
    if (!survey) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    await this.surveysRepository.remove(survey);
    return { success: true };
  }

  async submitPublicResponse(publicSlug: string, dto: SubmitSurveyResponseDto, meta: RequestMeta) {
    const survey = await this.surveysRepository.findOne({
      where: { publicSlug, isActive: true },
      relations: {
        questions: { options: true },
      },
    });

    if (!survey || !this.isSurveyAvailable(survey)) {
      throw new NotFoundException('Encuesta publica no disponible');
    }

    const questionMap = new Map(survey.questions.map((question) => [question.id, question]));

    for (const question of survey.questions) {
      const answer = dto.answers.find((item) => item.questionId === question.id);
      if (question.requerida && !answer) {
        throw new BadRequestException(`La pregunta "${question.titulo}" es obligatoria`);
      }

      if (answer) {
        this.validateAnswer(question, answer);
      }
    }

    const studentCode = dto.studentCode.trim();
    const studentName = dto.studentName.trim();
    const studentEmail = dto.studentEmail.trim().toLowerCase();

    if (!studentCode || !studentName || !studentEmail) {
      throw new BadRequestException('Codigo, nombre y correo son obligatorios');
    }

    return this.dataSource.transaction(async (manager) => {
      const responseRepo = manager.getRepository(SurveyResponse);
      const answerRepo = manager.getRepository(ResponseAnswer);
      const optionRepo = manager.getRepository(QuestionOption);

      const response = responseRepo.create({
        surveyId: survey.id,
        studentCode,
        studentName,
        studentEmail,
        ipAddress: meta.ipAddress ?? null,
        userAgent: meta.userAgent ?? null,
      });

      const savedResponse = await responseRepo.save(response);

      for (const submitted of dto.answers) {
        const question = questionMap.get(submitted.questionId);
        if (!question) {
          throw new BadRequestException('La respuesta contiene una pregunta invalida');
        }

        const answer = answerRepo.create({
          responseId: savedResponse.id,
          questionId: question.id,
          valueText: submitted.valueText ?? null,
          valueNumber: submitted.valueNumber ?? null,
        });

        const savedAnswer = await answerRepo.save(answer);

        if (submitted.selectedOptionIds && submitted.selectedOptionIds.length > 0) {
          const options = await optionRepo.find({
            where: submitted.selectedOptionIds.map((optionId) => ({ id: optionId, questionId: question.id })),
          });

          if (options.length !== submitted.selectedOptionIds.length) {
            throw new BadRequestException('Se enviaron opciones invalidas');
          }

          savedAnswer.selectedOptions = options;
          await answerRepo.save(savedAnswer);
        }
      }

      return { success: true, responseId: savedResponse.id };
    });
  }

  private async saveQuestions(
    manager: DataSource['manager'],
    surveyId: string,
    questions: CreateSurveyQuestionDto[],
  ) {
    const questionRepo = manager.getRepository(SurveyQuestion);
    const optionRepo = manager.getRepository(QuestionOption);

    for (const questionDto of questions) {
      const question = questionRepo.create({
        surveyId,
        titulo: questionDto.titulo,
        descripcion: questionDto.descripcion ?? null,
        questionType: questionDto.tipo,
        requerida: questionDto.requerida,
        orden: questionDto.orden,
      });

      const savedQuestion = await questionRepo.save(question);
      const shouldHaveOptions =
        questionDto.tipo === QuestionType.SINGLE_CHOICE ||
        questionDto.tipo === QuestionType.MULTIPLE_CHOICE;

      if (shouldHaveOptions && questionDto.options && questionDto.options.length > 0) {
        const options = questionDto.options.map((optionDto) =>
          optionRepo.create({
            questionId: savedQuestion.id,
            etiqueta: optionDto.etiqueta,
            valor: optionDto.valor,
            orden: optionDto.orden,
          }),
        );

        await optionRepo.save(options);
      }
    }
  }

  private validateAnswer(question: SurveyQuestion, answer: SubmitSurveyResponseDto['answers'][number]) {
    switch (question.questionType) {
      case QuestionType.SHORT_TEXT:
      case QuestionType.LONG_TEXT:
        if (question.requerida && !answer.valueText?.trim()) {
          throw new BadRequestException(`La pregunta "${question.titulo}" requiere texto`);
        }
        break;
      case QuestionType.NUMBER:
      case QuestionType.RATING:
        if (question.requerida && answer.valueNumber === undefined) {
          throw new BadRequestException(`La pregunta "${question.titulo}" requiere un valor numerico`);
        }
        break;
      case QuestionType.SINGLE_CHOICE:
        if (!answer.selectedOptionIds || answer.selectedOptionIds.length !== 1) {
          throw new BadRequestException(`La pregunta "${question.titulo}" requiere una opcion`);
        }
        break;
      case QuestionType.MULTIPLE_CHOICE:
        if (question.requerida && (!answer.selectedOptionIds || answer.selectedOptionIds.length === 0)) {
          throw new BadRequestException(`La pregunta "${question.titulo}" requiere al menos una opcion`);
        }
        break;
      default:
        break;
    }
  }

  private mapSurveySummary(survey: Survey) {
    return {
      id: survey.id,
      titulo: survey.titulo,
      descripcion: survey.descripcion,
      publicSlug: survey.publicSlug,
      isActive: survey.isActive,
      startsAt: survey.startsAt?.toISOString() ?? null,
      endsAt: survey.endsAt?.toISOString() ?? null,
      route: survey.route
        ? {
            id: survey.route.id,
            nombreRuta: survey.route.nombreRuta,
            descripcion: survey.route.descripcion,
            createdAt: survey.route.createdAt.toISOString(),
            updatedAt: survey.route.updatedAt.toISOString(),
          }
        : null,
      questionsCount: survey.questions?.length ?? 0,
      responsesCount: survey.responses?.length ?? 0,
      createdAt: survey.createdAt.toISOString(),
    };
  }

  private mapSurveyDetail(survey: Survey) {
    return {
      ...this.mapSurveySummary(survey),
      questions: [...survey.questions]
        .sort((a, b) => a.orden - b.orden)
        .map((question) => ({
          id: question.id,
          titulo: question.titulo,
          descripcion: question.descripcion,
          tipo: question.questionType,
          requerida: question.requerida,
          orden: question.orden,
          options: [...(question.options ?? [])]
            .sort((a, b) => a.orden - b.orden)
            .map((option) => ({
              id: option.id,
              etiqueta: option.etiqueta,
              valor: option.valor,
              orden: option.orden,
            })),
        })),
    };
  }

  private mapSurveyPublic(survey: Survey) {
    return {
      id: survey.id,
      titulo: survey.titulo,
      descripcion: survey.descripcion,
      publicSlug: survey.publicSlug,
      route: {
        id: survey.route.id,
        nombreRuta: survey.route.nombreRuta,
        descripcion: survey.route.descripcion,
      },
      questions: [...survey.questions]
        .sort((a, b) => a.orden - b.orden)
        .map((question) => ({
          id: question.id,
          titulo: question.titulo,
          descripcion: question.descripcion,
          tipo: question.questionType,
          requerida: question.requerida,
          orden: question.orden,
          options: [...(question.options ?? [])]
            .sort((a, b) => a.orden - b.orden)
            .map((option) => ({
              id: option.id,
              etiqueta: option.etiqueta,
              valor: option.valor,
              orden: option.orden,
            })),
        })),
    };
  }

  private isSurveyAvailable(survey: Survey) {
    const now = new Date();
    const afterStart = !survey.startsAt || survey.startsAt <= now;
    const beforeEnd = !survey.endsAt || survey.endsAt >= now;
    return survey.isActive && afterStart && beforeEnd;
  }

  private buildPublicSlug(title: string, seed?: string) {
    const base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);

    return `${base || 'encuesta'}-${(seed ?? randomUUID()).slice(0, 8)}`;
  }
}
