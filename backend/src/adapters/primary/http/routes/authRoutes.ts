import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { IAuthUseCase } from '../../../../ports/primary/IAuthUseCase';

export function createAuthRoutes(authUseCase: IAuthUseCase): Router {
  const router = Router();
  const authController = new AuthController(authUseCase);

  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
}

