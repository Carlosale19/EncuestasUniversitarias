import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UsersService } from './modules/users/users.service.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const allowedOrigins = Array.from(new Set([
        ...(process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []),
        'http://localhost:5173',
        'http://localhost:5174',
    ]));
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const usersService = app.get(UsersService);
    await usersService.ensureAdminUser();
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(`API escuchando en http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map