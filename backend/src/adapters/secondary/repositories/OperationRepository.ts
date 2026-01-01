import { PrismaClient, ParentType, OperationType } from '@prisma/client';
import { IOperationRepository } from '../../../ports/secondary/IOperationRepository';
import { Operation } from '../../../domain/entities/Operation';

const prismaOperationTypeToDomain: Record<OperationType, '+' | '-' | '*' | '/'> = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
};

const domainOperationTypeToPrisma: Record<'+' | '-' | '*' | '/', OperationType> = {
  '+': 'ADD',
  '-': 'SUBTRACT',
  '*': 'MULTIPLY',
  '/': 'DIVIDE',
};

export class OperationRepository implements IOperationRepository {
  constructor(private prisma: PrismaClient) {}

  async findByParent(parentId: number, parentType: 'starting_number' | 'operation'): Promise<Operation[]> {
    const prismaParentType = (parentType === 'starting_number' ? 'STARTING_NUMBER' : 'OPERATION') as ParentType;
    
    const operations = await this.prisma.operation.findMany({
      where: {
        parentId,
        parentType: prismaParentType,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return operations.map(
      (op) =>
        new Operation(
          op.id,
          op.parentId,
          parentType,
          op.userId,
          prismaOperationTypeToDomain[op.operationType],
          op.rightOperand,
          op.createdAt,
          undefined,
          op.user.username
        )
    );
  }

  async findById(id: number): Promise<Operation | null> {
    const operation = await this.prisma.operation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!operation) return null;

    const parentType = operation.parentType === 'STARTING_NUMBER' ? 'starting_number' : 'operation';

    return new Operation(
      operation.id,
      operation.parentId,
      parentType,
      operation.userId,
      prismaOperationTypeToDomain[operation.operationType],
      operation.rightOperand,
      operation.createdAt,
      undefined,
      operation.user.username
    );
  }

  async create(
    parentId: number,
    parentType: 'starting_number' | 'operation',
    userId: number,
    operationType: string,
    rightOperand: number
  ): Promise<Operation> {
    const prismaParentType = (parentType === 'starting_number' ? 'STARTING_NUMBER' : 'OPERATION') as ParentType;
    const prismaOperationType = domainOperationTypeToPrisma[operationType as '+' | '-' | '*' | '/'];

    const operation = await this.prisma.operation.create({
      data: {
        parentId,
        parentType: prismaParentType,
        userId,
        operationType: prismaOperationType,
        rightOperand,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return new Operation(
      operation.id,
      operation.parentId,
      parentType,
      operation.userId,
      prismaOperationTypeToDomain[operation.operationType],
      operation.rightOperand,
      operation.createdAt,
      undefined,
      operation.user.username
    );
  }

  async findStartingNumberValue(id: number): Promise<number | null> {
    const startingNumber = await this.prisma.startingNumber.findUnique({
      where: { id },
      select: { value: true },
    });

    return startingNumber?.value ?? null;
  }

  async findOperationById(id: number): Promise<Operation | null> {
    return this.findById(id);
  }
}

