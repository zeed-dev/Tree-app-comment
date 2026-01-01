import { Operation, ParentType } from '../../domain/entities/Operation';

export interface IOperationRepository {
  findByParent(parentId: number, parentType: ParentType): Promise<Operation[]>;
  findById(id: number): Promise<Operation | null>;
  create(
    parentId: number,
    parentType: ParentType,
    userId: number,
    operationType: string,
    rightOperand: number
  ): Promise<Operation>;
  findStartingNumberValue(id: number): Promise<number | null>;
  findOperationById(id: number): Promise<Operation | null>;
}

