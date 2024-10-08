-- AlterTable
ALTER TABLE "records" ADD COLUMN     "ycRecordData" JSONB,
ALTER COLUMN "dkdDate" DROP NOT NULL;
