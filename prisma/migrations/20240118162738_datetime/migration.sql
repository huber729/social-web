-- DropIndex
DROP INDEX "Subscribe_subscribedToId_key";

-- DropIndex
DROP INDEX "Subscribe_subscriberId_key";

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
