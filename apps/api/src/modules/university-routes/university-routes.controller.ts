import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { CreateUniversityRouteDto } from './dto/create-university-route.dto.js';
import { UpdateUniversityRouteDto } from './dto/update-university-route.dto.js';
import { UniversityRoutesService } from './university-routes.service.js';

@Controller('university-routes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversityRoutesController {
  constructor(@Inject(UniversityRoutesService) private readonly routesService: UniversityRoutesService) {}

  @Get()
  list() {
    return this.routesService.findAll();
  }

  @Post()
  create(@Body() body: CreateUniversityRouteDto) {
    return this.routesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUniversityRouteDto) {
    return this.routesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}
