-- Add missing review fields to Property table
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3);
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "submittedForApprovalAt" TIMESTAMP(3);
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;

-- Add missing values to PropertyStatus enum
ALTER TYPE "PropertyStatus" ADD VALUE IF NOT EXISTS 'pending_approval';
ALTER TYPE "PropertyStatus" ADD VALUE IF NOT EXISTS 'rejected';


-- Create PaymentType enum
DO $$ BEGIN
    CREATE TYPE "PaymentType" AS ENUM ('subscription', 'commission');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create PaymentStatus enum
DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
    "id"            TEXT NOT NULL,
    "userId"        TEXT NOT NULL,
    "type"          "PaymentType" NOT NULL,
    "amount"        DOUBLE PRECISION NOT NULL,
    "status"        "PaymentStatus" NOT NULL DEFAULT 'pending',
    "reference"     TEXT NOT NULL,
    "method"        TEXT NOT NULL DEFAULT 'manual',
    "proofImageUrl" TEXT,
    "verifiedBy"    TEXT,
    "relatedId"     TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Payment_reference_key" UNIQUE ("reference")
);

-- Add foreign key Payment -> User
DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
