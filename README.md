# Calculation Tree Application

A full-stack application where users communicate through numbers and mathematical operations, creating tree-like calculation chains similar to social media comment threads.

## Architecture

This project follows **Hexagonal Architecture (Ports & Adapters)** pattern:

- **Domain Layer**: Core business logic, entities, and use cases
- **Ports**: Interfaces defining contracts (primary for input, secondary for output)
- **Adapters**: Implementations (HTTP controllers, PostgreSQL repositories)

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL with Prisma ORM
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React + TypeScript
- Vite
- Axios for API calls

## Project Structure

```
calculation-tree-app/
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/          # Domain models
│   │   │   └── use-cases/         # Business logic
│   │   ├── ports/
│   │   │   ├── primary/           # Input interfaces (use cases)
│   │   │   └── secondary/         # Output interfaces (repositories)
│   │   ├── adapters/
│   │   │   ├── primary/           # HTTP controllers, routes
│   │   │   └── secondary/         # Database repositories
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── contexts/              # React contexts
│   │   ├── services/              # API services
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose (for local database)
- PostgreSQL (if not using Docker)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd calculation-tree-app
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env and set:
   # DATABASE_URL="postgresql://calculation_user:calculation_password@localhost:5432/calculation_tree?schema=public"
   # JWT_SECRET="your-secret-key"
   # PORT=3001
   
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Start backend server
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file (optional, defaults to http://localhost:3001/api)
   # VITE_API_URL=http://localhost:3001/api
   
   # Start frontend dev server
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the complete deployment guide.

### Quick Deploy

**Backend (Railway):**
1. Push code to GitHub
2. Create new project on Railway
3. Add PostgreSQL database
4. Set environment variables: `DATABASE_URL`, `JWT_SECRET`
5. Deploy backend service
6. Run migrations: `npx prisma migrate deploy`

**Frontend (Vercel):**
1. Import project from GitHub (set root directory to `frontend`)
2. Set environment variable: `VITE_API_URL=https://your-backend.railway.app/api`
3. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Calculations
- `GET /api/calculations/starting-numbers` - Get all starting numbers (public)
- `GET /api/calculations/operations/:parentType/:parentId` - Get operations for a parent (public)
- `POST /api/calculations/starting-numbers` - Create starting number (authenticated)
- `POST /api/calculations/operations` - Create operation (authenticated)

## Features

- ✅ View calculation tree as unregistered user
- ✅ User registration and authentication
- ✅ Create starting numbers (authenticated users)
- ✅ Add operations to starting numbers or other operations
- ✅ Recursive calculation tree display
- ✅ Real-time result calculation

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio to view database

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Database Schema

- **users**: User accounts with username and hashed password
- **starting_numbers**: Initial numbers that start calculation chains
- **operations**: Mathematical operations (+,-,*,/) that build on starting numbers or other operations

## License

ISC

