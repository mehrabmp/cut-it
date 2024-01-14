ALTER TABLE account ADD `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE session ADD `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE user ADD `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;--> statement-breakpoint
ALTER TABLE verificationToken ADD `created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL;