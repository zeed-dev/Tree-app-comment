import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createAuthRoutes } from './adapters/primary/http/routes/authRoutes';
import { createCalculationRoutes } from './adapters/primary/http/routes/calculationRoutes';
import { AuthUseCase } from './domain/use-cases/AuthUseCase';
import { CalculationUseCase } from './domain/use-cases/CalculationUseCase';
import { UserRepository } from './adapters/secondary/repositories/UserRepository';
import { StartingNumberRepository } from './adapters/secondary/repositories/StartingNumberRepository';
import { OperationRepository } from './adapters/secondary/repositories/OperationRepository';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize repositories (secondary adapters)
const userRepository = new UserRepository(prisma);
const startingNumberRepository = new StartingNumberRepository(prisma);
const operationRepository = new OperationRepository(prisma);

// Initialize use cases
const authUseCase = new AuthUseCase(userRepository);
const calculationUseCase = new CalculationUseCase(startingNumberRepository, operationRepository);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', createAuthRoutes(authUseCase));
app.use('/api/calculations', createCalculationRoutes(calculationUseCase));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

