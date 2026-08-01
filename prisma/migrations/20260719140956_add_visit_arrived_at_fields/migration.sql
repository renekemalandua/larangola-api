-- AlterTable
ALTER TABLE "ScheduledVisit" ADD COLUMN     "agentArrivedAt" TIMESTAMP(3),
ADD COLUMN     "clientArrivedAt" TIMESTAMP(3);
