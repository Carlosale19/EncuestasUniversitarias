import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUniversityRouteDto } from './dto/create-university-route.dto.js';
import { UpdateUniversityRouteDto } from './dto/update-university-route.dto.js';
import { UniversityRoute } from './university-route.entity.js';

@Injectable()
export class UniversityRoutesService {
  constructor(
    @InjectRepository(UniversityRoute)
    private readonly routesRepository: Repository<UniversityRoute>,
  ) {}

  findAll() {
    return this.routesRepository.find({ order: { createdAt: 'DESC' } });
  }

  create(dto: CreateUniversityRouteDto) {
    const route = this.routesRepository.create({
      nombreRuta: dto.nombreRuta,
      descripcion: dto.descripcion ?? null,
    });

    return this.routesRepository.save(route);
  }

  async update(id: string, dto: UpdateUniversityRouteDto) {
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

  async remove(id: string) {
    const route = await this.routesRepository.findOne({
      where: { id },
      relations: ['surveys'],
    });
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }

    if (route.surveys && route.surveys.length > 0) {
      throw new BadRequestException(
        `No es posible eliminar la ruta "${route.nombreRuta}" porque tiene ${route.surveys.length} encuesta(s) asociada(s). Debe eliminar o reasignar las encuestas primero.`
      );
    }

    await this.routesRepository.remove(route);
    return { success: true };
  }
}
