/*
  Warnings:

  - Made the column `videoUrl` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "videoUrl" SET NOT NULL;
