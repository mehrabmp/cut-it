DROP INDEX IF EXISTS `key_idx`;--> statement-breakpoint
ALTER TABLE links ADD `slug` text(256) NOT NULL;--> statement-breakpoint
ALTER TABLE links ADD `user_id` integer;--> statement-breakpoint
ALTER TABLE links ADD `created_at` integer DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
ALTER TABLE links ADD `updated_at` integer DEFAULT (strftime('%s', 'now'));--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `links` (`slug`);--> statement-breakpoint
ALTER TABLE `links` DROP COLUMN `key`;--> statement-breakpoint
ALTER TABLE `links` DROP COLUMN `userId`;--> statement-breakpoint
ALTER TABLE `links` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `links` DROP COLUMN `updatedAt`;