/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Subscribe` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscribe_subscribedToId_key";

-- DropIndex
DROP INDEX "Subscribe_subscriberId_key";

-- AlterTable
ALTER TABLE "Subscribe" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Subscribe_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscribe_id_key" ON "Subscribe"("id");
