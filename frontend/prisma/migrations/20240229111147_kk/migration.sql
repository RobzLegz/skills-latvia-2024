/*
  Warnings:

  - You are about to drop the column `userId` on the `Song` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Song` DROP FOREIGN KEY `Song_userId_fkey`;

-- AlterTable
ALTER TABLE `Playlist` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Song` DROP COLUMN `userId`,
    ADD COLUMN `length` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL;
