export type ParentType = 'starting_number' | 'operation';
export type OperationType = '+' | '-' | '*' | '/';

export class Operation {
  constructor(
    public id: number,
    public parentId: number,
    public parentType: ParentType,
    public userId: number,
    public operationType: OperationType,
    public rightOperand: number,
    public createdAt: Date,
    public result?: number,
    public username?: string
  ) {}
}

