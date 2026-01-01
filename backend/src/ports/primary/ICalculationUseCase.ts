import { StartingNumber } from '../../domain/entities/StartingNumber';
import { Operation, ParentType } from '../../domain/entities/Operation';

export interface CreateStartingNumberRequest {
  userId: number;
  value: number;
}

export interface CreateOperationRequest {
  userId: number;
  parentId: number;
  parentType: ParentType;
  operationType: string;
  rightOperand: number;
}

export interface ICalculationUseCase {
  getAllStartingNumbers(): Promise<StartingNumber[]>;
  getOperationsByParent(parentId: number, parentType: ParentType): Promise<Operation[]>;
  createStartingNumber(request: CreateStartingNumberRequest): Promise<StartingNumber>;
  createOperation(request: CreateOperationRequest): Promise<Operation>;
}

