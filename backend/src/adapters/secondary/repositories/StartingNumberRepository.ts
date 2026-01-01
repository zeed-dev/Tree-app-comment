import { PrismaClient } from '@prisma/client';
import { IStartingNumberRepository } from '../../../ports/secondary/IStartingNumberRepository';
import { StartingNumber } from '../../../domain/entities/StartingNumber';

export class StartingNumberRepository implements IStartingNumberRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<StartingNumber[]> {
    const startingNumbers = await this.prisma.startingNumber.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return startingNumbers.map(
      (sn) =>
        new StartingNumber(
          sn.id,
          sn.userId,
          sn.value,
          sn.createdAt,
          sn.user.username
        )
    );
  }

  async findById(id: number): Promise<StartingNumber | null> {
    const startingNumber = await this.prisma.startingNumber.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!startingNumber) return null;

    return new StartingNumber(
      startingNumber.id,
      startingNumber.userId,
      startingNumber.value,
      startingNumber.createdAt,
      startingNumber.user.username
    );
  }

  async create(userId: number, value: number): Promise<StartingNumber> {
    const startingNumber = await this.prisma.startingNumber.create({
      data: {
        userId,
        value,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return new StartingNumber(
      startingNumber.id,
      startingNumber.userId,
      startingNumber.value,
      startingNumber.createdAt,
      startingNumber.user.username
    );
  }
}

