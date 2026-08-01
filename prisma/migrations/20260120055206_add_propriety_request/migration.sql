-- CreateEnum
CREATE TYPE "PropertyRequestStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED');

-- CreateTable
CREATE TABLE "PropertyRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "minPrice" DOUBLE PRECISION,
    "maxPrice" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "status" "PropertyRequestStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PropertyRequest" ADD CONSTRAINT "PropertyRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
