/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `Creation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Creation" DROP COLUMN "publishedAt";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
