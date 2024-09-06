/*
  Warnings:

  - The primary key for the `clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `clientId` column on the `records` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `staffId` column on the `records` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `clientId` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `staffId` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `salons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `staff_contacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `staffId` column on the `staff_contacts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `userId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `salonId` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `clients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `records` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `salons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tgBotName` to the `salons` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `salons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tgBotId` on the `salons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `staff` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `staff_contacts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `tgUserId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tgChatId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContactTypes" ADD VALUE 'INSTAGRAM';
ALTER TYPE "ContactTypes" ADD VALUE 'VK';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRoles" ADD VALUE 'ADMIN';
ALTER TYPE "UserRoles" ADD VALUE 'SUPERADMIN';
ALTER TYPE "UserRoles" ADD VALUE 'USER';

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_clientId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_staffId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_clientId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_staffId_fkey";

-- DropForeignKey
ALTER TABLE "staff_contacts" DROP CONSTRAINT "staff_contacts_staffId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_salonId_fkey";

-- AlterTable
ALTER TABLE "clients" DROP CONSTRAINT "clients_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "records" DROP CONSTRAINT "records_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "clientId",
ADD COLUMN     "clientId" UUID,
DROP COLUMN "staffId",
ADD COLUMN     "staffId" UUID,
ADD CONSTRAINT "records_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "clientId",
ADD COLUMN     "clientId" UUID,
DROP COLUMN "staffId",
ADD COLUMN     "staffId" UUID,
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "salons" DROP CONSTRAINT "salons_pkey",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tgBotName" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "tgBotId",
ADD COLUMN     "tgBotId" BIGINT NOT NULL,
ADD CONSTRAINT "salons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "staff" DROP CONSTRAINT "staff_pkey",
ADD COLUMN     "dkdMasterId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "staff_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "staff_contacts" DROP CONSTRAINT "staff_contacts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "staffId",
ADD COLUMN     "staffId" UUID,
ADD CONSTRAINT "staff_contacts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "tgUserId",
ADD COLUMN     "tgUserId" BIGINT NOT NULL,
DROP COLUMN "tgChatId",
ADD COLUMN     "tgChatId" BIGINT NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID,
DROP COLUMN "salonId",
ADD COLUMN     "salonId" UUID,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "salons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_contacts" ADD CONSTRAINT "staff_contacts_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
