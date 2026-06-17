import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('surveys/:id/results')
  getSurveyResults(@Param('id') id: string) {
    return this.dashboardService.getSurveyResults(id);
  }
}
