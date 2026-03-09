-- AlterTable
ALTER TABLE "files" ADD COLUMN     "newfilename" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'unknown',
ALTER COLUMN "name" SET DEFAULT 'unknown';
