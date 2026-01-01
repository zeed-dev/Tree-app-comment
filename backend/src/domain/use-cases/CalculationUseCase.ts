import {
  ICalculationUseCase,
  CreateStartingNumberRequest,
  CreateOperationRequest,
} from '../../ports/primary/ICalculationUseCase';
import { IStartingNumberRepository } from '../../ports/secondary/IStartingNumberRepository';
import { IOperationRepository } from '../../ports/secondary/IOperationRepository';
import { Operation, ParentType } from '../../domain/entities/Operation';
import { StartingNumber } from '../../domain/entities/StartingNumber';

export class CalculationUseCase implements ICalculationUseCase {
  constructor(
    private startingNumberRepository: IStartingNumberRepository,
    private operationRepository: IOperationRepository
  ) {}

  async getAllStartingNumbers(): Promise<StartingNumber[]> {
    return this.startingNumberRepository.findAll();
  }

  async getOperationsByParent(parentId: number, parentType: ParentType): Promise<Operation[]> {
    const operations = await this.operationRepository.findByParent(parentId, parentType);
    
    // Calculate results for each operation
    const operationsWithResults = await Promise.all(
      operations.map(async (op) => {
        try {
          const result = await this.calculateResult(op.id, 'operation');
          return { ...op, result };
        } catch (error) {
          return { ...op, result: NaN };
        }
      })
    );

    return operationsWithResults;
  }

  async createStartingNumber(request: CreateStartingNumberRequest): Promise<StartingNumber> {
    if (request.value === undefined || request.value === null) {
      throw new Error('Value is required');
    }

    if (isNaN(request.value)) {
      throw new Error('Value must be a valid number');
    }

    return this.startingNumberRepository.create(request.userId, request.value);
  }

  async createOperation(request: CreateOperationRequest): Promise<Operation> {
    if (!request.parentId || !request.parentType || !request.operationType || request.rightOperand === undefined) {
      throw new Error('All fields are required');
    }

    if (request.parentType !== 'starting_number' && request.parentType !== 'operation') {
      throw new Error('Invalid parent type');
    }

    if (!['+', '-', '*', '/'].includes(request.operationType)) {
      throw new Error('Invalid operation type');
    }

    if (isNaN(request.rightOperand)) {
      throw new Error('Right operand must be a valid number');
    }

    // Verify parent exists
    if (request.parentType === 'starting_number') {
      const parent = await this.startingNumberRepository.findById(request.parentId);
      if (!parent) {
        throw new Error('Parent starting number not found');
      }
    } else {
      const parent = await this.operationRepository.findById(request.parentId);
      if (!parent) {
        throw new Error('Parent operation not found');
      }
    }

    // Check for division by zero
    if (request.operationType === '/' && request.rightOperand === 0) {
      throw new Error('Division by zero is not allowed');
    }

    // Try to calculate result to verify it's valid
    try {
      await this.calculateResult(request.parentId, request.parentType);
    } catch (error: any) {
      throw new Error(error.message || 'Invalid calculation');
    }

    const operation = await this.operationRepository.create(
      request.parentId,
      request.parentType,
      request.userId,
      request.operationType,
      request.rightOperand
    );

    // Calculate and set result
    const result = await this.calculateResult(operation.id, 'operation');
    return { ...operation, result };
  }

  private async calculateResult(parentId: number, parentType: ParentType): Promise<number> {
    if (parentType === 'starting_number') {
      const value = await this.operationRepository.findStartingNumberValue(parentId);
      if (value === null) {
        throw new Error('Starting number not found');
      }
      return value;
    } else {
      const operation = await this.operationRepository.findOperationById(parentId);
      if (!operation) {
        throw new Error('Operation not found');
      }

      const leftValue = await this.calculateResult(operation.parentId, operation.parentType);
      const rightValue = operation.rightOperand;

      switch (operation.operationType) {
        case '+':
          return leftValue + rightValue;
        case '-':
          return leftValue - rightValue;
        case '*':
          return leftValue * rightValue;
        case '/':
          if (rightValue === 0) {
            throw new Error('Division by zero');
          }
          return leftValue / rightValue;
        default:
          throw new Error('Invalid operation type');
      }
    }
  }
}

