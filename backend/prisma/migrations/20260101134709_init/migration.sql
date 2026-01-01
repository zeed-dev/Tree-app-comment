-- CreateEnum
CREATE TYPE "ParentType" AS ENUM ('STARTING_NUMBER', 'OPERATION');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "starting_numbers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "starting_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "parent_type" "ParentType" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "operation_type" "OperationType" NOT NULL,
    "right_operand" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "operations_parent_id_parent_type_idx" ON "operations"("parent_id", "parent_type");

-- AddForeignKey
ALTER TABLE "starting_numbers" ADD CONSTRAINT "starting_numbers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
