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
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { UserRole } from './user-role.enum.js';
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    findAll() {
        return this.usersRepository.find({ order: { createdAt: 'DESC' } }).then((users) => users.map((user) => this.sanitizeUser(user)));
    }
    findByEmail(email) {
        return this.usersRepository.findOne({ where: { email: email.trim().toLowerCase() } });
    }
    async create(dto) {
        const existing = await this.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('El correo ya se encuentra registrado');
        }
        const user = this.usersRepository.create({
            name: dto.name,
            email: dto.email,
            role: dto.role,
            isActive: dto.isActive ?? true,
            passwordHash: await hash(dto.password, 10),
        });
        return this.usersRepository.save(user).then((savedUser) => this.sanitizeUser(savedUser));
    }
    async update(id, dto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        if (dto.email && dto.email !== user.email) {
            const existing = await this.findByEmail(dto.email);
            if (existing && existing.id !== id) {
                throw new ConflictException('El correo ya se encuentra registrado');
            }
        }
        Object.assign(user, dto);
        return this.usersRepository.save(user).then((savedUser) => this.sanitizeUser(savedUser));
    }
    async changePassword(id, dto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        user.passwordHash = await hash(dto.password, 10);
        await this.usersRepository.save(user);
        return { success: true };
    }
    async ensureAdminUser() {
        const existingAdmin = await this.usersRepository.findOne({ where: { email: 'admin@universidad.edu' } });
        if (existingAdmin) {
            return;
        }
        const admin = this.usersRepository.create({
            name: 'Administrador General',
            email: 'admin@universidad.edu',
            role: UserRole.ADMIN,
            isActive: true,
            passwordHash: await hash('Admin12345', 10),
        });
        await this.usersRepository.save(admin);
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [Repository])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map