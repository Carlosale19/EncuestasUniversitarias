var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { CreateSurveyDto } from './dto/create-survey.dto.js';
import { SubmitSurveyResponseDto } from './dto/submit-survey-response.dto.js';
import { UpdateSurveyStatusDto } from './dto/update-survey-status.dto.js';
import { UpdateSurveyDto } from './dto/update-survey.dto.js';
import { SurveysService } from './surveys.service.js';
let SurveysController = class SurveysController {
    constructor(surveysService) {
        this.surveysService = surveysService;
    }
    listAdmin() {
        return this.surveysService.findAll();
    }
    getAdmin(id) {
        return this.surveysService.findOneAdmin(id);
    }
    createAdmin(body, req) {
        return this.surveysService.create(body, req.user.id);
    }
    updateAdmin(id, body) {
        return this.surveysService.update(id, body);
    }
    updateStatus(id, body) {
        return this.surveysService.updateStatus(id, body.isActive);
    }
    remove(id) {
        return this.surveysService.remove(id);
    }
    getPublic(publicSlug) {
        return this.surveysService.findPublicBySlug(publicSlug);
    }
    submitPublic(publicSlug, body, req) {
        return this.surveysService.submitPublicResponse(publicSlug, body, {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
    }
};
__decorate([
    Get('surveys'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "listAdmin", null);
__decorate([
    Get('surveys/:id'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "getAdmin", null);
__decorate([
    Post('surveys'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSurveyDto, Object]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "createAdmin", null);
__decorate([
    Patch('surveys/:id'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSurveyDto]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "updateAdmin", null);
__decorate([
    Patch('surveys/:id/status'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSurveyStatusDto]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "updateStatus", null);
__decorate([
    Delete('surveys/:id'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "remove", null);
__decorate([
    Get('public/surveys/:publicSlug'),
    __param(0, Param('publicSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "getPublic", null);
__decorate([
    Post('public/surveys/:publicSlug/responses'),
    __param(0, Param('publicSlug')),
    __param(1, Body()),
    __param(2, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SubmitSurveyResponseDto, Object]),
    __metadata("design:returntype", void 0)
], SurveysController.prototype, "submitPublic", null);
SurveysController = __decorate([
    Controller(),
    __param(0, Inject(SurveysService)),
    __metadata("design:paramtypes", [SurveysService])
], SurveysController);
export { SurveysController };
//# sourceMappingURL=surveys.controller.js.map