CREATE TABLE `linkItem` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`linkId` text,
	`title` text(256),
	`description` text,
	`slug` text(256) NOT NULL,
	`url` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`linkId`) REFERENCES `link`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `link` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `links`;--> statement-breakpoint
CREATE INDEX `linkId_idx` ON `linkItem` (`linkId`);--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `linkItem` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `links_userId_idx` ON `link` (`userId`);