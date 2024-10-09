/*
  Warnings:

  - You are about to drop the column `name` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `staff_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `staff_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `staff_contacts` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `staff_contacts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffId,contactId]` on the table `staff_contacts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactId` to the `staff_contacts` table without a default value. This is not possible if the table is not empty.
  - Made the column `staffId` on table `staff_contacts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "ContactTypes" ADD VALUE 'PHONE';

-- DropForeignKey
ALTER TABLE "staff_contacts" DROP CONSTRAINT "staff_contacts_staffId_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "name",
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "salons" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "coordinateLat" TEXT,
ADD COLUMN     "coordinateLon" TEXT,
ADD COLUMN     "currencyShortTitle" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "schedule" TEXT;

-- AlterTable
ALTER TABLE "staff_contacts" DROP COLUMN "createdAt",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
DROP COLUMN "value",
ADD COLUMN     "contactId" UUID NOT NULL,
ALTER COLUMN "staffId" SET NOT NULL;

-- CreateTable
CREATE TABLE "masters" (
    "id" UUID NOT NULL,
    "extId" TEXT,
    "name" TEXT,
    "post" TEXT,
    "imageUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "weight" INTEGER,
    "bookable" BOOLEAN,
    "salonId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "masters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "extId" TEXT,
    "name" TEXT,
    "imageUrl" TEXT,
    "time" INTEGER,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "weight" INTEGER,
    "salonId" UUID,
    "categoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_services" (
    "id" UUID NOT NULL,
    "masterId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "time" INTEGER,
    "priceMin" INTEGER,
    "priceMax" INTEGER,

    CONSTRAINT "master_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" UUID NOT NULL,
    "extId" TEXT,
    "name" TEXT,
    "salonId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "type" "ContactTypes" NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salon_contacts" (
    "id" UUID NOT NULL,
    "salonId" UUID NOT NULL,
    "contactId" UUID NOT NULL,

    CONSTRAINT "salon_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_services_masterId_serviceId_key" ON "master_services"("masterId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "salon_contacts_salonId_contactId_key" ON "salon_contacts"("salonId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_contacts_staffId_contactId_key" ON "staff_contacts"("staffId", "contactId");

-- AddForeignKey
ALTER TABLE "masters" ADD CONSTRAINT "masters_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "salons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "salons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_services" ADD CONSTRAINT "master_services_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "masters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_services" ADD CONSTRAINT "master_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "salons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon_contacts" ADD CONSTRAINT "salon_contacts_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "salons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salon_contacts" ADD CONSTRAINT "salon_contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_contacts" ADD CONSTRAINT "staff_contacts_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_contacts" ADD CONSTRAINT "staff_contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
