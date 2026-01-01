import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Import bcryptjs dynamically to handle ES modules
  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default || bcryptModule;

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.operation.deleteMany();
  await prisma.startingNumber.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      username: 'alice',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'bob',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'charlie',
      password: hashedPassword,
    },
  });

  console.log('Created users:', user1.username, user2.username, user3.username);

  // Create starting numbers
  const startingNumber1 = await prisma.startingNumber.create({
    data: {
      userId: user1.id,
      value: 10,
    },
  });

  const startingNumber2 = await prisma.startingNumber.create({
    data: {
      userId: user2.id,
      value: 100,
    },
  });

  const startingNumber3 = await prisma.startingNumber.create({
    data: {
      userId: user3.id,
      value: 5,
    },
  });

  console.log('Created starting numbers:', startingNumber1.value, startingNumber2.value, startingNumber3.value);

  // Create operations for startingNumber1 (10)
  const op1 = await prisma.operation.create({
    data: {
      parentId: startingNumber1.id,
      parentType: 'STARTING_NUMBER',
      userId: user2.id,
      operationType: 'ADD',
      rightOperand: 5, // 10 + 5 = 15
    },
  });

  const op2 = await prisma.operation.create({
    data: {
      parentId: startingNumber1.id,
      parentType: 'STARTING_NUMBER',
      userId: user3.id,
      operationType: 'MULTIPLY',
      rightOperand: 3, // 10 * 3 = 30
    },
  });

  // Create operation on op1 (15)
  const op3 = await prisma.operation.create({
    data: {
      parentId: op1.id,
      parentType: 'OPERATION',
      userId: user1.id,
      operationType: 'SUBTRACT',
      rightOperand: 3, // 15 - 3 = 12
    },
  });

  // Create operation on op2 (30)
  const op4 = await prisma.operation.create({
    data: {
      parentId: op2.id,
      parentType: 'OPERATION',
      userId: user2.id,
      operationType: 'DIVIDE',
      rightOperand: 2, // 30 / 2 = 15
    },
  });

  // Create operations for startingNumber2 (100)
  const op5 = await prisma.operation.create({
    data: {
      parentId: startingNumber2.id,
      parentType: 'STARTING_NUMBER',
      userId: user1.id,
      operationType: 'SUBTRACT',
      rightOperand: 20, // 100 - 20 = 80
    },
  });

  const op6 = await prisma.operation.create({
    data: {
      parentId: startingNumber2.id,
      parentType: 'STARTING_NUMBER',
      userId: user3.id,
      operationType: 'DIVIDE',
      rightOperand: 4, // 100 / 4 = 25
    },
  });

  // Create operation on op5 (80)
  const op7 = await prisma.operation.create({
    data: {
      parentId: op5.id,
      parentType: 'OPERATION',
      userId: user2.id,
      operationType: 'ADD',
      rightOperand: 10, // 80 + 10 = 90
    },
  });

  console.log('Created operations');
  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

