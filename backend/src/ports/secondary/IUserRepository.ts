import { User } from '../../domain/entities/User';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(username: string, hashedPassword: string): Promise<User>;
}

