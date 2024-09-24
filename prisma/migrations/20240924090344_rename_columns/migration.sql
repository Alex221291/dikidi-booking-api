-- AlterTable
ALTER TABLE "records"
RENAME COLUMN "extDate" TO "extDate";
ALTER TABLE "records"
RENAME COLUMN "dkdRecordId" TO "extRecordId";
ALTER TABLE "records"
RENAME COLUMN "ycRecordData" TO "extRecordData";
ALTER TABLE "records"
RENAME COLUMN "ycRecordHash" TO "extRecordHash";

-- AlterTable
ALTER TABLE "salons"
RENAME COLUMN "extCompanyId" TO "extCompanyId";

-- AlterTable
ALTER TABLE "staff"
RENAME COLUMN "dkdMasterId" TO "extMasterId";

