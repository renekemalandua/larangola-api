-- CreateEnum
CREATE TYPE "DealStage" AS ENUM ('VISIT_SCHEDULED', 'VISIT_COMPLETED', 'NEGOTIATION', 'WAITING_PAYMENT', 'PAYMENT_SUBMITTED', 'DEAL_CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlatformFeeStatus" AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "ClosedDeal" ADD COLUMN     "adminRejectionReason" TEXT,
ADD COLUMN     "adminReviewedAt" TIMESTAMP(3),
ADD COLUMN     "adminReviewedBy" TEXT,
ADD COLUMN     "agentConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "agentFeeReceiptUrl" TEXT,
ADD COLUMN     "agentFeeSubmittedAt" TIMESTAMP(3),
ADD COLUMN     "clientPaidAt" TIMESTAMP(3),
ADD COLUMN     "clientPaymentReceiptNote" TEXT,
ADD COLUMN     "clientPaymentReceiptUrl" TEXT,
ADD COLUMN     "dealAmount" DOUBLE PRECISION,
ADD COLUMN     "dealType" TEXT,
ADD COLUMN     "isOwnerAccount" BOOLEAN DEFAULT false,
ADD COLUMN     "paymentAccountHolder" TEXT,
ADD COLUMN     "paymentBankName" TEXT,
ADD COLUMN     "paymentIban" TEXT,
ADD COLUMN     "platformFeeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "platformFeeRate" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
ADD COLUMN     "platformFeeStatus" "PlatformFeeStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stage" "DealStage" NOT NULL DEFAULT 'VISIT_SCHEDULED';

-- CreateTable
CREATE TABLE "AgentBankAccount" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "accountHolder" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentBankAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AgentBankAccount" ADD CONSTRAINT "AgentBankAccount_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
