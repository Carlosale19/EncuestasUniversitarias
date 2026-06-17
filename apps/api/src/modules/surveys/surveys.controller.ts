import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { CreateSurveyDto } from './dto/create-survey.dto.js';
import { SubmitSurveyResponseDto } from './dto/submit-survey-response.dto.js';
import { UpdateSurveyStatusDto } from './dto/update-survey-status.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import { SurveysService } from './surveys.service.js';

@Controller()
export class SurveysController {
  constructor(@Inject(SurveysService) private readonly surveysService: SurveysService) {}

  @Get('surveys')
  @UseGuards(JwtAuthGuard, RolesGuard)
  listAdmin() {
    return this.surveysService.findAll();
  }

  @Get('surveys/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAdmin(@Param('id') id: string) {
    return this.surveysService.findOneAdmin(id);
  }

  @Post('surveys')
  @UseGuards(JwtAuthGuard, RolesGuard)
  createAdmin(@Body() body: CreateSurveyDto, @Req() req: Request) {
    return this.surveysService.create(body, (req.user as { id: string }).id);
  }

  @Patch('surveys/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateAdmin(@Param('id') id: string, @Body() body: UpdateSurveyDto) {
    return this.surveysService.update(id, body);
  }

  @Patch('surveys/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStatus(@Param('id') id: string, @Body() body: UpdateSurveyStatusDto) {
    return this.surveysService.updateStatus(id, body.isActive);
  }

  @Delete('surveys/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.surveysService.remove(id);
  }

  @Get('public/surveys/:publicSlug')
  getPublic(@Param('publicSlug') publicSlug: string) {
    return this.surveysService.findPublicBySlug(publicSlug);
  }

  @Post('public/surveys/:publicSlug/responses')
  submitPublic(
    @Param('publicSlug') publicSlug: string,
    @Body() body: SubmitSurveyResponseDto,
    @Req() req: Request,
  ) {
    return this.surveysService.submitPublicResponse(publicSlug, body, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }
}
