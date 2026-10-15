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
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniversityRoute } from './university-route.entity.js';
let UniversityRoutesService = class UniversityRoutesService {
    constructor(routesRepository) {
        this.routesRepository = routesRepository;
    }
    findAll() {
        return this.routesRepository.find({ order: { createdAt: 'DESC' } });
    }
    create(dto) {
        const route = this.routesRepository.create({
            nombreRuta: dto.nombreRuta,
            descripcion: dto.descripcion ?? null,
        });
        return this.routesRepository.save(route);
    }
    async update(id, dto) {
        const route = await this.routesRepository.findOne({ where: { id } });
        if (!route) {
            throw new NotFoundException('Ruta no encontrada');
        }
        if (dto.nombreRuta !== undefined) {
            route.nombreRuta = dto.nombreRuta;
        }
        if (dto.descripcion !== undefined) {
            route.descripcion = dto.descripcion;
        }
        return this.routesRepository.save(route);
    }
    async remove(id) {
        const route = await this.routesRepository.findOne({
            where: { id },
            relations: ['surveys'],
        });
        if (!route) {
            throw new NotFoundException('Ruta no encontrada');
        }
        if (route.surveys && route.surveys.length > 0) {
            throw new BadRequestException(`No es posible eliminar la ruta "${route.nombreRuta}" porque tiene ${route.surveys.length} encuesta(s) asociada(s). Debe eliminar o reasignar las encuestas primero.`);
        }
        await this.routesRepository.remove(route);
        return { success: true };
    }
};
UniversityRoutesService = __decorate([
    Injectable(),
    __param(0, InjectRepository(UniversityRoute)),
    __metadata("design:paramtypes", [Repository])
], UniversityRoutesService);
export { UniversityRoutesService };
//# sourceMappingURL=university-routes.service.js.map