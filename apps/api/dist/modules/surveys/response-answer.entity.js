var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { SurveyResponse } from './survey-response.entity.js';
import { SurveyQuestion } from './survey-question.entity.js';
import { QuestionOption } from './question-option.entity.js';
let ResponseAnswer = class ResponseAnswer {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ResponseAnswer.prototype, "id", void 0);
__decorate([
    ManyToOne(() => SurveyResponse, (response) => response.answers, { nullable: false, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'response_id' }),
    __metadata("design:type", Object)
], ResponseAnswer.prototype, "response", void 0);
__decorate([
    Column({ name: 'response_id', type: 'uuid' }),
    __metadata("design:type", String)
], ResponseAnswer.prototype, "responseId", void 0);
__decorate([
    ManyToOne(() => SurveyQuestion, (question) => question.answers, { nullable: false, onDelete: 'CASCADE' }),
    JoinColumn({ name: 'question_id' }),
    __metadata("design:type", Object)
], ResponseAnswer.prototype, "question", void 0);
__decorate([
    Column({ name: 'question_id', type: 'uuid' }),
    __metadata("design:type", String)
], ResponseAnswer.prototype, "questionId", void 0);
__decorate([
    Column({ name: 'value_text', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ResponseAnswer.prototype, "valueText", void 0);
__decorate([
    Column({ name: 'value_number', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], ResponseAnswer.prototype, "valueNumber", void 0);
__decorate([
    ManyToMany(() => QuestionOption, (option) => option.answers),
    JoinTable({
        name: 'answer_selected_options',
        joinColumn: { name: 'answer_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'option_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Object)
], ResponseAnswer.prototype, "selectedOptions", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], ResponseAnswer.prototype, "createdAt", void 0);
ResponseAnswer = __decorate([
    Entity({ name: 'response_answers' })
], ResponseAnswer);
export { ResponseAnswer };
//# sourceMappingURL=response-answer.entity.js.map