var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayMinSize, IsArray, IsEmail, IsNumber, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
export class SubmitSurveyAnswerDto {
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], SubmitSurveyAnswerDto.prototype, "questionId", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], SubmitSurveyAnswerDto.prototype, "valueText", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], SubmitSurveyAnswerDto.prototype, "valueNumber", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    IsUUID('4', { each: true }),
    __metadata("design:type", Array)
], SubmitSurveyAnswerDto.prototype, "selectedOptionIds", void 0);
export class SubmitSurveyResponseDto {
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SubmitSurveyResponseDto.prototype, "studentCode", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SubmitSurveyResponseDto.prototype, "studentName", void 0);
__decorate([
    IsEmail(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SubmitSurveyResponseDto.prototype, "studentEmail", void 0);
__decorate([
    IsArray(),
    ArrayMinSize(1),
    ValidateNested({ each: true }),
    Type(() => SubmitSurveyAnswerDto),
    __metadata("design:type", Array)
], SubmitSurveyResponseDto.prototype, "answers", void 0);
//# sourceMappingURL=submit-survey-response.dto.js.map