# LarAngola API

Backend API for LarAngola mobile application.

## Architecture

This project follows Clean Architecture / Hexagonal Architecture patterns:

- **Entities**: Domain models with business logic
- **Repositories**: Data access abstraction (interfaces + Prisma implementations)
- **Use Cases**: Application business logic
- **Controllers**: HTTP endpoints
- **Adapters**: Data transformation between layers
- **DTOs**: Data Transfer Objects for API requests/responses

## Tech Stack

- NestJS
- Prisma
- PostgreSQL
- TypeScript

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Start development server:
```bash
npm run start:dev
```

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api/doc`

