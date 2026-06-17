var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Survey } from '../surveys/survey.entity.js';
import { UserRole } from './user-role.enum.js';
let User = class User {
    normalizeEmail() {
        this.email = this.email.trim().toLowerCase();
    }
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Column({ type: 'varchar', length: 160, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ name: 'password_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    Column({ type: 'enum', enum: UserRole, default: UserRole.OPERATOR }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    OneToMany(() => Survey, (survey) => survey.createdBy),
    __metadata("design:type", Object)
], User.prototype, "surveys", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    BeforeInsert(),
    BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "normalizeEmail", null);
User = __decorate([
    Entity({ name: 'users' })
], User);
export { User };
//# sourceMappingURL=user.entity.js.map