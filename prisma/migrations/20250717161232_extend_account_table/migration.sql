-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "idToken" TEXT,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "sessionState" TEXT,
ADD COLUMN     "tokenType" TEXT;
