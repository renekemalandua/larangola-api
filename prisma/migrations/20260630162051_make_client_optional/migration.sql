-- DropForeignKey
ALTER TABLE "ClosedDeal" DROP CONSTRAINT "ClosedDeal_clientId_fkey";

-- AlterTable
ALTER TABLE "ClosedDeal" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClosedDeal" ADD CONSTRAINT "ClosedDeal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
