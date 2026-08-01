-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('NONE', 'AUDITOR', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminRole" "AdminRole" NOT NULL DEFAULT 'NONE';
