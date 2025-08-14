/*
  Warnings:

  - You are about to drop the column `voteBalance` on the `Answer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "voteBalance",
ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false;
