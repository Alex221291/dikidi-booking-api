-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('DIRECTOR', 'ADMINISTRATOR', 'MASTER', 'CLIENT');

-- CreateEnum
CREATE TYPE "ContactTypes" AS ENUM ('TELEGRAM', 'VIBER', 'WHATSAPP');

-- CreateTable
CREATE TABLE "salons" (
    "id" TEXT NOT NULL,
    "dkdCompanyId" TEXT NOT NULL,
    "tgBotId" TEXT NOT NULL,
    "tgToken" TEXT NOT NULL,

    CONSTRAINT "salons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tgUserId" TEXT,
    "tgUserName" TEXT,
    "tgChatId" TEXT,
    "userId" TEXT,
    "role" "UserRoles" NOT NULL,
    "salonId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER,
    "clientId" TEXT,
    "staffId" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" TEXT NOT NULL,
    "dkdRecordId" TEXT,
    "clientId" TEXT,
    "staffId" TEXT,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_contacts" (
    "id" TEXT NOT NULL,
    "type" "ContactTypes" NOT NULL,
    "value" TEXT,
    "staffId" TEXT,

    CONSTRAINT "staff_contacts_pkey" PRIMARY KEY ("id")
);

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
