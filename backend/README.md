# Backend - Calculation Tree API

Backend API built with Node.js, TypeScript, Express, and PostgreSQL using Hexagonal Architecture pattern.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
DATABASE_URL="postgresql://calculation_user:calculation_password@localhost:5432/calculation_tree?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3001
```

3. Start PostgreSQL (using Docker Compose from root):
```bash
docker-compose up -d
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Start development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio to view/edit database

## Architecture

This backend follows Hexagonal Architecture (Ports & Adapters):

- **Domain Layer** (`src/domain/`): Core business logic, entities, and use cases
- **Ports** (`src/ports/`): Interfaces defining contracts
  - `primary/`: Input interfaces (use cases)
  - `secondary/`: Output interfaces (repositories)
- **Adapters** (`src/adapters/`): Implementations
  - `primary/`: HTTP controllers and routes
  - `secondary/`: Database repositories (Prisma)

