import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../ports/secondary/IUserRepository';
import { User } from '../../../domain/entities/User';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;

    return new User(user.id, user.username, user.password, user.createdAt);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(user.id, user.username, user.password, user.createdAt);
  }

  async create(username: string, hashedPassword: string): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return new User(user.id, user.username, user.password, user.createdAt);
  }
}

