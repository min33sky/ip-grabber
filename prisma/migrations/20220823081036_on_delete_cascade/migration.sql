-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_trackId_fkey";

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
