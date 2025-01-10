/*
  Warnings:

  - You are about to drop the column `roomId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `hotel` table. All the data in the column will be lost.
  - You are about to drop the `room` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hotelId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `room` DROP FOREIGN KEY `Room_hotelId_fkey`;

-- DropIndex
DROP INDEX `Booking_roomId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `roomId`,
    ADD COLUMN `hotelId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `hotel` DROP COLUMN `address`,
    ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 0.0;

-- DropTable
DROP TABLE `room`;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
