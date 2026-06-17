import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { User } from './user.entity.js';
import { UserRole } from './user-role.enum.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } }).then((users) => users.map((user) => this.sanitizeUser(user)));
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email: email.trim().toLowerCase() } });
  }

  async create(dto: CreateUserDto) {
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

  async update(id: string, dto: UpdateUserDto) {
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

  async changePassword(id: string, dto: ChangePasswordDto) {
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

  private sanitizeUser(user: User) {
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
}
