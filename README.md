# Encuestas Universitarias

Software full stack para la gestion de encuestas de rutas universitarias con panel administrativo, autenticacion JWT, enlace publico por encuesta y dashboard analitico.

## Estructura

- `apps/api`: API REST en NestJS + TypeORM + PostgreSQL
- `apps/admin-web`: frontend en React + TailwindCSS + Recharts
- `migrations`: esquema inicial SQL
- `.trae/documents`: PRD y arquitectura tecnica aprobada

## Requisitos

- Node.js 20 o superior
- PostgreSQL 16 o superior

## Variables de entorno

1. Copia `apps/api/.env.example` como `apps/api/.env`
2. Copia `apps/admin-web/.env.example` como `apps/admin-web/.env`

## Base de datos

1. Crea la base `encuestas_universitarias`
2. Ejecuta el script `migrations/20260615_initial_schema.sql` si quieres aprovisionar la estructura manualmente
3. Tambien puedes iniciar con `DB_SYNC=true` para que TypeORM sincronice el esquema

## Credenciales iniciales

- Correo: `admin@universidad.edu`
- Contrasena: `Admin12345`

La API crea este usuario automaticamente al iniciar si no existe.

## Desarrollo

Instalar dependencias:

```bash
npm install
```

Levantar API:

```bash
npm run dev:api
```

Levantar frontend:

```bash
npm run dev:web
```

## Scripts utiles

```bash
npm run check
npm run build
npm run test
```

## Docker Compose

Archivos incluidos para despliegue:

- `docker-compose.yml`
- `Dockerfile.api`
- `Dockerfile.web`
- `.env.docker.example`

### Levantar localmente con Docker

1. Copia `.env.docker.example` como `.env`
2. Ajusta al menos `JWT_SECRET`
3. Ejecuta:

```bash
docker compose up -d --build
```

Servicios:

- Frontend: `http://localhost:8080`
- API: disponible a traves de `http://localhost:8080/api`
- PostgreSQL: contenedor interno `postgres`

### Despliegue en Dockploy

1. Sube el repositorio a GitHub
2. En Dockploy crea una aplicacion basada en `docker-compose.yml`
3. Define las variables de entorno del archivo `.env.docker.example`
4. Publica el servicio `web` en el dominio que quieras usar
5. Mantén `VITE_API_URL` en `/api`, porque Nginx ya redirige el frontend al servicio `api`

Notas:

- El frontend se sirve con Nginx y soporta rutas SPA
- Nginx redirige `/api/*` al contenedor `api`
- PostgreSQL usa un volumen persistente llamado `postgres_data`
- La API crea el usuario administrador inicial al arrancar si no existe
- En producción conviene cambiar `DB_SYNC` a `false` cuando migres a un esquema estable

## Modulos implementados

- Login administrativo sin registro publico
- CRUD de usuarios con cambio de contrasena y activacion/desactivacion
- CRUD de rutas universitarias
- CRUD de encuestas con constructor de preguntas dinamicas
- Publicacion de encuesta en `/encuesta/:publicSlug`
- Captura publica de respuestas
- Dashboard con graficas y registros individuales
