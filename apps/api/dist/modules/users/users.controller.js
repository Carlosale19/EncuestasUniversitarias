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
import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt-auth.guard.js';
import { Roles } from '../../common/roles.decorator.js';
import { RolesGuard } from '../../common/roles.guard.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UserRole } from './user-role.enum.js';
import { UsersService } from './users.service.js';
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    list() {
        return this.usersService.findAll();
    }
    create(body) {
        return this.usersService.create(body);
    }
    update(id, body) {
        return this.usersService.update(id, body);
    }
    changePassword(id, body) {
        return this.usersService.changePassword(id, body);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "list", null);
__decorate([
    Post(),
    Roles(UserRole.ADMIN),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    Patch(':id'),
    Roles(UserRole.ADMIN),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    Patch(':id/password'),
    Roles(UserRole.ADMIN),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changePassword", null);
UsersController = __decorate([
    Controller('users'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Inject(UsersService)),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map