-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_folderId_fkey";

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "folderId" DROP NOT NULL,
ALTER COLUMN "folderId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
