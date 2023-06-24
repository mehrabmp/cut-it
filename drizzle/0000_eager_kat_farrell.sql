CREATE TABLE `links` (
	`id` integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`title` text(256),
	`description` text,
	`key` text(256) NOT NULL,
	`url` text NOT NULL,
	`userId` integer NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')),
	`updatedAt` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer AUTO_INCREMENT PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `key_idx` ON `links` (`key`);