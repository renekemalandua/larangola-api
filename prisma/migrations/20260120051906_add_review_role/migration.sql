/*
  Warnings:

  - Added the required column `role` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReviewRole" AS ENUM ('AGENT', 'ROOMMATE');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "role" "ReviewRole" NOT NULL;
