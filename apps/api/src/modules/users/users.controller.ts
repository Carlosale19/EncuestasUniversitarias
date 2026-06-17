import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { Roles } from '../../common/roles.decorator.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UserRole } from './user-role.enum.js';
import { UsersService } from './users.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Patch(':id/password')
  @Roles(UserRole.ADMIN)
  changePassword(@Param('id') id: string, @Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(id, body);
  }
}
