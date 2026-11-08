-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('MEETING_ROOM', 'PRIVATE_OFFICE', 'COWORKING_DESK', 'EVENT_SPACE');

-- CreateEnum
CREATE TYPE "WorkspacePricingType" AS ENUM ('PER_HOUR', 'PER_DAY', 'BOTH');

-- CreateTable
CREATE TABLE "WorkspaceDetails" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "workspaceType" "WorkspaceType" NOT NULL,
    "pricingType" "WorkspacePricingType" NOT NULL DEFAULT 'BOTH',
    "pricePerHour" DOUBLE PRECISION,
    "pricePerDay" DOUBLE PRECISION,
    "capacitySeats" INTEGER NOT NULL,
    "minBookingHours" INTEGER NOT NULL DEFAULT 1,
    "hasHighSpeedWifi" BOOLEAN NOT NULL DEFAULT true,
    "hasGenerator" BOOLEAN NOT NULL DEFAULT true,
    "hasProjector" BOOLEAN NOT NULL DEFAULT false,
    "hasWhiteboard" BOOLEAN NOT NULL DEFAULT false,
    "hasAirConditioning" BOOLEAN NOT NULL DEFAULT true,
    "hasCoffeeBreak" BOOLEAN NOT NULL DEFAULT false,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceDetails_propertyId_key" ON "WorkspaceDetails"("propertyId");

-- AddForeignKey
ALTER TABLE "WorkspaceDetails" ADD CONSTRAINT "WorkspaceDetails_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
