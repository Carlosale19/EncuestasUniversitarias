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
import { User } from '../users/user.entity.js';
import { UniversityRoute } from '../university-routes/university-route.entity.js';
import { SurveyQuestion } from './survey-question.entity.js';
import { SurveyResponse } from './survey-response.entity.js';
let Survey = class Survey {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Survey.prototype, "id", void 0);
__decorate([
    ManyToOne(() => UniversityRoute, (route) => route.surveys, { nullable: false, onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'route_id' }),
    __metadata("design:type", Object)
], Survey.prototype, "route", void 0);
__decorate([
    Column({ name: 'route_id', type: 'uuid' }),
    __metadata("design:type", String)
], Survey.prototype, "routeId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.surveys, { nullable: false, onDelete: 'RESTRICT' }),
    JoinColumn({ name: 'created_by' }),
    __metadata("design:type", Object)
], Survey.prototype, "createdBy", void 0);
__decorate([
    Column({ name: 'created_by', type: 'uuid' }),
    __metadata("design:type", String)
], Survey.prototype, "createdById", void 0);
__decorate([
    Column({ type: 'varchar', length: 180 }),
    __metadata("design:type", String)
], Survey.prototype, "titulo", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Survey.prototype, "descripcion", void 0);
__decorate([
    Column({ name: 'public_slug', type: 'varchar', length: 180, unique: true }),
    __metadata("design:type", String)
], Survey.prototype, "publicSlug", void 0);
__decorate([
    Column({ name: 'is_active', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Survey.prototype, "isActive", void 0);
__decorate([
    Column({ name: 'starts_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Survey.prototype, "startsAt", void 0);
__decorate([
    Column({ name: 'ends_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Survey.prototype, "endsAt", void 0);
__decorate([
    OneToMany(() => SurveyQuestion, (question) => question.survey, { cascade: true }),
    __metadata("design:type", Object)
], Survey.prototype, "questions", void 0);
__decorate([
    OneToMany(() => SurveyResponse, (response) => response.survey),
    __metadata("design:type", Object)
], Survey.prototype, "responses", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Survey.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Survey.prototype, "updatedAt", void 0);
Survey = __decorate([
    Entity({ name: 'surveys' })
], Survey);
export { Survey };
//# sourceMappingURL=survey.entity.js.map