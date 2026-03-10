/*
  Warnings:

  - You are about to drop the column `size` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "size",
ADD COLUMN     "size_in_bytes" INTEGER NOT NULL DEFAULT 0;
