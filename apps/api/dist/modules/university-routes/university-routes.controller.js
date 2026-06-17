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
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { CreateUniversityRouteDto } from './dto/create-university-route.dto.js';
import { UpdateUniversityRouteDto } from './dto/update-university-route.dto.js';
import { UniversityRoutesService } from './university-routes.service.js';
let UniversityRoutesController = class UniversityRoutesController {
    constructor(routesService) {
        this.routesService = routesService;
    }
    list() {
        return this.routesService.findAll();
    }
    create(body) {
        return this.routesService.create(body);
    }
    update(id, body) {
        return this.routesService.update(id, body);
    }
    remove(id) {
        return this.routesService.remove(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UniversityRoutesController.prototype, "list", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUniversityRouteDto]),
    __metadata("design:returntype", void 0)
], UniversityRoutesController.prototype, "create", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUniversityRouteDto]),
    __metadata("design:returntype", void 0)
], UniversityRoutesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UniversityRoutesController.prototype, "remove", null);
UniversityRoutesController = __decorate([
    Controller('university-routes'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Inject(UniversityRoutesService)),
    __metadata("design:paramtypes", [UniversityRoutesService])
], UniversityRoutesController);
export { UniversityRoutesController };
//# sourceMappingURL=university-routes.controller.js.map