var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { SurveyQuestion } from './survey-question.entity.js';
import { ResponseAnswer } from './response-answer.entity.js';
let QuestionOption = class QuestionOption {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], QuestionOption.prototype, "id", void 0);
__decorate([
    ManyToOne(() => SurveyQuestion, (question) => question.options, { nullable: false, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'question_id' }),
    __metadata("design:type", Object)
], QuestionOption.prototype, "question", void 0);
__decorate([
    Column({ name: 'question_id', type: 'uuid' }),
    __metadata("design:type", String)
], QuestionOption.prototype, "questionId", void 0);
__decorate([
    Column({ type: 'varchar', length: 160 }),
    __metadata("design:type", String)
], QuestionOption.prototype, "etiqueta", void 0);
__decorate([
    Column({ type: 'varchar', length: 160 }),
    __metadata("design:type", String)
], QuestionOption.prototype, "valor", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], QuestionOption.prototype, "orden", void 0);
__decorate([
    ManyToMany(() => ResponseAnswer, (answer) => answer.selectedOptions),
    __metadata("design:type", Object)
], QuestionOption.prototype, "answers", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], QuestionOption.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], QuestionOption.prototype, "updatedAt", void 0);
QuestionOption = __decorate([
    Entity({ name: 'question_options' })
], QuestionOption);
export { QuestionOption };
//# sourceMappingURL=question-option.entity.js.map