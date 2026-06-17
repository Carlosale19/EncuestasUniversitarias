var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Survey } from './survey.entity.js';
import { QuestionType } from './question-type.enum.js';
import { QuestionOption } from './question-option.entity.js';
import { ResponseAnswer } from './response-answer.entity.js';
let SurveyQuestion = class SurveyQuestion {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SurveyQuestion.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Survey, (survey) => survey.questions, { nullable: false, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'survey_id' }),
    __metadata("design:type", Object)
], SurveyQuestion.prototype, "survey", void 0);
__decorate([
    Column({ name: 'survey_id', type: 'uuid' }),
    __metadata("design:type", String)
], SurveyQuestion.prototype, "surveyId", void 0);
__decorate([
    Column({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], SurveyQuestion.prototype, "titulo", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SurveyQuestion.prototype, "descripcion", void 0);
__decorate([
    Column({ name: 'question_type', type: 'enum', enum: QuestionType }),
    __metadata("design:type", String)
], SurveyQuestion.prototype, "questionType", void 0);
__decorate([
    Column({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SurveyQuestion.prototype, "requerida", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], SurveyQuestion.prototype, "orden", void 0);
__decorate([
    OneToMany(() => QuestionOption, (option) => option.question, { cascade: true }),
    __metadata("design:type", Object)
], SurveyQuestion.prototype, "options", void 0);
__decorate([
    OneToMany(() => ResponseAnswer, (answer) => answer.question),
    __metadata("design:type", Object)
], SurveyQuestion.prototype, "answers", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], SurveyQuestion.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], SurveyQuestion.prototype, "updatedAt", void 0);
SurveyQuestion = __decorate([
    Entity({ name: 'survey_questions' })
], SurveyQuestion);
export { SurveyQuestion };
//# sourceMappingURL=survey-question.entity.js.map