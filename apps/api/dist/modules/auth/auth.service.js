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
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service.js';
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Credenciales invalidas');
        }
        const passwordMatches = await compare(password, user.passwordHash);
        if (!passwordMatches) {
            throw new UnauthorizedException('Credenciales invalidas');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        return {
            accessToken: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, Inject(UsersService)),
    __param(1, Inject(JwtService)),
    __metadata("design:paramtypes", [UsersService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map