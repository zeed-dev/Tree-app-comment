import { StartingNumber } from '../../domain/entities/StartingNumber';

export interface IStartingNumberRepository {
  findAll(): Promise<StartingNumber[]>;
  findById(id: number): Promise<StartingNumber | null>;
  create(userId: number, value: number): Promise<StartingNumber>;
}

