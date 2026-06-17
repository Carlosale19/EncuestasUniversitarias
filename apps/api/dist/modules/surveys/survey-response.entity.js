var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from 'typeorm';
import { Survey } from './survey.entity.js';
import { ResponseAnswer } from './response-answer.entity.js';
let SurveyResponse = class SurveyResponse {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SurveyResponse.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Survey, (survey) => survey.responses, { nullable: false, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'survey_id' }),
    __metadata("design:type", Object)
], SurveyResponse.prototype, "survey", void 0);
__decorate([
    Column({ name: 'survey_id', type: 'uuid' }),
    __metadata("design:type", String)
], SurveyResponse.prototype, "surveyId", void 0);
__decorate([
    Column({ name: 'student_code', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], SurveyResponse.prototype, "studentCode", void 0);
__decorate([
    Column({ name: 'student_name', type: 'varchar', length: 160, nullable: true }),
    __metadata("design:type", Object)
], SurveyResponse.prototype, "studentName", void 0);
__decorate([
    Column({ name: 'student_email', type: 'varchar', length: 160, nullable: true }),
    __metadata("design:type", Object)
], SurveyResponse.prototype, "studentEmail", void 0);
__decorate([
    Column({ name: 'ip_address', type: 'inet', nullable: true }),
    __metadata("design:type", Object)
], SurveyResponse.prototype, "ipAddress", void 0);
__decorate([
    Column({ name: 'user_agent', type: 'varchar', length: 512, nullable: true }),
    __metadata("design:type", Object)
], SurveyResponse.prototype, "userAgent", void 0);
__decorate([
    OneToMany(() => ResponseAnswer, (answer) => answer.response, { cascade: true }),
    __metadata("design:type", Object)
], SurveyResponse.prototype, "answers", void 0);
__decorate([
    CreateDateColumn({ name: 'submitted_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], SurveyResponse.prototype, "submittedAt", void 0);
SurveyResponse = __decorate([
    Entity({ name: 'survey_responses' })
], SurveyResponse);
export { SurveyResponse };
//# sourceMappingURL=survey-response.entity.js.map