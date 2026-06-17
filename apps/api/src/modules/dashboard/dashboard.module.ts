import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from '../surveys/survey.entity.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
