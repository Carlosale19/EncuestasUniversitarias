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

## Modulos implementados

- Login administrativo sin registro publico
- CRUD de usuarios con cambio de contrasena y activacion/desactivacion
- CRUD de rutas universitarias
- CRUD de encuestas con constructor de preguntas dinamicas
- Publicacion de encuesta en `/encuesta/:publicSlug`
- Captura publica de respuestas
- Dashboard con graficas y registros individuales
