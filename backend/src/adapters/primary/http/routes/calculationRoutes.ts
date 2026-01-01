import { Router } from 'express';
import { CalculationController } from '../controllers/CalculationController';
import { ICalculationUseCase } from '../../../../ports/primary/ICalculationUseCase';
import { authenticateToken } from '../middleware/auth';

export function createCalculationRoutes(calculationUseCase: ICalculationUseCase): Router {
  const router = Router();
  const calculationController = new CalculationController(calculationUseCase);

  router.get('/starting-numbers', (req, res) => calculationController.getAllStartingNumbers(req, res));
  router.get('/operations/:parentType/:parentId', (req, res) => 
    calculationController.getOperationsByParent(req, res)
  );
  router.post('/starting-numbers', authenticateToken, (req, res) => 
    calculationController.createStartingNumber(req, res)
  );
  router.post('/operations', authenticateToken, (req, res) => 
    calculationController.createOperation(req, res)
  );

  return router;
}

