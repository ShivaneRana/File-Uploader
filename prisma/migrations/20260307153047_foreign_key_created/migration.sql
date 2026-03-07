-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "userId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
