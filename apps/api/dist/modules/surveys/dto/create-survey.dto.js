var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../question-type.enum.js';
export class CreateQuestionOptionDto {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateQuestionOptionDto.prototype, "etiqueta", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateQuestionOptionDto.prototype, "valor", void 0);
__decorate([
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], CreateQuestionOptionDto.prototype, "orden", void 0);
export class CreateSurveyQuestionDto {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateSurveyQuestionDto.prototype, "titulo", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateSurveyQuestionDto.prototype, "descripcion", void 0);
__decorate([
    IsEnum(QuestionType),
    __metadata("design:type", String)
], CreateSurveyQuestionDto.prototype, "tipo", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateSurveyQuestionDto.prototype, "requerida", void 0);
__decorate([
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], CreateSurveyQuestionDto.prototype, "orden", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateQuestionOptionDto),
    __metadata("design:type", Array)
], CreateSurveyQuestionDto.prototype, "options", void 0);
export class CreateSurveyDto {
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "routeId", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "titulo", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "descripcion", void 0);
__decorate([
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateSurveyDto.prototype, "isActive", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "startsAt", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateSurveyDto.prototype, "endsAt", void 0);
__decorate([
    IsArray(),
    ArrayMinSize(1),
    ValidateNested({ each: true }),
    Type(() => CreateSurveyQuestionDto),
    __metadata("design:type", Array)
], CreateSurveyDto.prototype, "questions", void 0);
//# sourceMappingURL=create-survey.dto.js.map