/*
  Warnings:

  - A unique constraint covering the columns `[subscriberId]` on the table `Subscribe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscribedToId]` on the table `Subscribe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscribe_subscriberId_key" ON "Subscribe"("subscriberId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscribe_subscribedToId_key" ON "Subscribe"("subscribedToId");
