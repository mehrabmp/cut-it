CREATE TABLE `userLink` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `linkItem`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
DROP INDEX IF EXISTS `links_userId_idx`;--> statement-breakpoint
ALTER TABLE link ADD `slug` text(256) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE link ADD `userLinkId` text NOT NULL REFERENCES userLink(id);--> statement-breakpoint
ALTER TABLE link ADD `title` text(256);--> statement-breakpoint
ALTER TABLE link ADD `description` text;--> statement-breakpoint
ALTER TABLE link ADD `url` text NOT NULL;--> statement-breakpoint
ALTER TABLE link ADD `views` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `userLinks_userId_idx` ON `userLink` (`userId`);--> statement-breakpoint
CREATE INDEX `userLinkId_idx` ON `link` (`userLinkId`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `link` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `link` DROP COLUMN `userId`;