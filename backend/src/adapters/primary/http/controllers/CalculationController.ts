import { Request, Response } from 'express';
import { ICalculationUseCase } from '../../../../ports/primary/ICalculationUseCase';
import { AuthRequest } from '../middleware/auth';
import { ParentType } from '../../../../domain/entities/Operation';

export class CalculationController {
  constructor(private calculationUseCase: ICalculationUseCase) {}

  async getAllStartingNumbers(req: Request, res: Response): Promise<void> {
    try {
      const startingNumbers = await this.calculationUseCase.getAllStartingNumbers();
      res.json(startingNumbers);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async getOperationsByParent(req: Request, res: Response): Promise<void> {
    try {
      const { parentType, parentId } = req.params;

      if (parentType !== 'starting_number' && parentType !== 'operation') {
        res.status(400).json({ error: 'Invalid parent type' });
        return;
      }

      const operations = await this.calculationUseCase.getOperationsByParent(
        parseInt(parentId),
        parentType as ParentType
      );
      res.json(operations);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async createStartingNumber(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { value } = req.body;
      const userId = req.userId!;

      const startingNumber = await this.calculationUseCase.createStartingNumber({
        userId,
        value: parseFloat(value),
      });

      res.status(201).json(startingNumber);
    } catch (error: any) {
      const statusCode = error.message.includes('required') || error.message.includes('valid number') ? 400 : 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }

  async createOperation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { parentId, parentType, operationType, rightOperand } = req.body;
      const userId = req.userId!;

      const operation = await this.calculationUseCase.createOperation({
        userId,
        parentId: parseInt(parentId),
        parentType: parentType as ParentType,
        operationType,
        rightOperand: parseFloat(rightOperand),
      });

      res.status(201).json(operation);
    } catch (error: any) {
      const statusCode = error.message.includes('required') || 
                        error.message.includes('Invalid') ||
                        error.message.includes('not found') ||
                        error.message.includes('Division by zero') ? 400 : 500;
      res.status(statusCode).json({ error: error.message || 'Internal server error' });
    }
  }
}

