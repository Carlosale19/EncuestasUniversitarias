var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Survey } from '../surveys/survey.entity.js';
let UniversityRoute = class UniversityRoute {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UniversityRoute.prototype, "id", void 0);
__decorate([
    Column({ name: 'nombre_ruta', type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], UniversityRoute.prototype, "nombreRuta", void 0);
__decorate([
    Column({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], UniversityRoute.prototype, "descripcion", void 0);
__decorate([
    OneToMany(() => Survey, (survey) => survey.route),
    __metadata("design:type", Object)
], UniversityRoute.prototype, "surveys", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], UniversityRoute.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], UniversityRoute.prototype, "updatedAt", void 0);
UniversityRoute = __decorate([
    Entity({ name: 'university_routes' })
], UniversityRoute);
export { UniversityRoute };
//# sourceMappingURL=university-route.entity.js.map