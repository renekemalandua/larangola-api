/*
  Warnings:

  - You are about to drop the column `listingId` on the `ClosedDeal` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `listingId` on the `PropertyInterest` table. All the data in the column will be lost.
  - You are about to drop the column `listingId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `listingId` on the `ScheduledVisit` table. All the data in the column will be lost.
  - You are about to drop the `Listing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `propertyId` to the `ClosedDeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `PropertyInterest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `ScheduledVisit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('draft', 'published', 'finished', 'canceled');

-- DropForeignKey
ALTER TABLE "ClosedDeal" DROP CONSTRAINT "ClosedDeal_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyInterest" DROP CONSTRAINT "PropertyInterest_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_listingId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduledVisit" DROP CONSTRAINT "ScheduledVisit_listingId_fkey";

-- AlterTable
ALTER TABLE "ClosedDeal" DROP COLUMN "listingId",
ADD COLUMN     "propertyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "ownerId",
ADD COLUMN     "agentId" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'AOA',
ADD COLUMN     "listingType" "ListingType",
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "status" "PropertyStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "PropertyInterest" DROP COLUMN "listingId",
ADD COLUMN     "propertyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "listingId",
ADD COLUMN     "propertyId" TEXT;

-- AlterTable
ALTER TABLE "ScheduledVisit" DROP COLUMN "listingId",
ADD COLUMN     "propertyId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Listing";

-- DropEnum
DROP TYPE "ListingStatus";

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledVisit" ADD CONSTRAINT "ScheduledVisit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClosedDeal" ADD CONSTRAINT "ClosedDeal_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyInterest" ADD CONSTRAINT "PropertyInterest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
