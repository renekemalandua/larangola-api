-- AlterTable
ALTER TABLE "AgentSubscription" ADD COLUMN     "highlightsUsed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "highlightedUntil" TIMESTAMP(3),
ADD COLUMN     "isHighlighted" BOOLEAN NOT NULL DEFAULT false;
