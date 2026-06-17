import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityRoute } from './university-route.entity.js';
import { UniversityRoutesController } from './university-routes.controller.js';
import { UniversityRoutesService } from './university-routes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([UniversityRoute])],
  controllers: [UniversityRoutesController],
  providers: [UniversityRoutesService],
  exports: [UniversityRoutesService, TypeOrmModule],
})
export class UniversityRoutesModule {}
