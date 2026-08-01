-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'VALIDATING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "PropertyAuditRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "propertyType" TEXT NOT NULL,
    "listingType" TEXT NOT NULL,
    "images" JSONB,
    "status" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "claimedByAgentId" TEXT,
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyAuditRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PropertyAuditRequest" ADD CONSTRAINT "PropertyAuditRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAuditRequest" ADD CONSTRAINT "PropertyAuditRequest_claimedByAgentId_fkey" FOREIGN KEY ("claimedByAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
