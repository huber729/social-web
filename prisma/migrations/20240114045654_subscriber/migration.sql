-- CreateTable
CREATE TABLE "Subscribe" (
    "subscriberId" INTEGER NOT NULL,
    "subscribedToId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscribe_subscriberId_key" ON "Subscribe"("subscriberId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscribe_subscribedToId_key" ON "Subscribe"("subscribedToId");

-- AddForeignKey
ALTER TABLE "Subscribe" ADD CONSTRAINT "Subscribe_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribe" ADD CONSTRAINT "Subscribe_subscribedToId_fkey" FOREIGN KEY ("subscribedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
