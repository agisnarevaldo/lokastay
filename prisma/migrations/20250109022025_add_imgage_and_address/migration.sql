-- AlterTable
ALTER TABLE `hotel` ADD COLUMN `address` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `image` VARCHAR(191) NOT NULL DEFAULT 'https://source.unsplash.com/random';
