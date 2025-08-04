PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pireps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`leg_id` integer NOT NULL,
	`submitted_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`callsign` text NOT NULL,
	`comment` text,
	`reviewer_id` text,
	`reviewed_at` integer,
	`review_note` text,
	`logbook_url` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leg_id`) REFERENCES `legs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "callsign_length_and_format" CHECK(length("__new_pireps"."callsign") <= 7 AND "__new_pireps"."callsign" GLOB '[A-Za-z0-9]*'),
	CONSTRAINT "comment_length" CHECK(length(coalesce("__new_pireps"."comment", '')) <= 100),
	CONSTRAINT "review_note_length" CHECK(length(coalesce("__new_pireps"."review_note", '')) <= 100)
);
--> statement-breakpoint
INSERT INTO `__new_pireps`("id", "user_id", "leg_id", "submitted_at", "status", "callsign", "comment", "reviewer_id", "reviewed_at", "review_note", "logbook_url") SELECT "id", "user_id", "leg_id", "submitted_at", "status", "callsign", "comment", "reviewer_id", "reviewed_at", "review_note", "logbook_url" FROM `pireps`;--> statement-breakpoint
DROP TABLE `pireps`;--> statement-breakpoint
ALTER TABLE `__new_pireps` RENAME TO `pireps`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_pireps_userId_status` ON `pireps` (`user_id`,`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `pireps_user_id_leg_id_unique` ON `pireps` (`user_id`,`leg_id`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "image", "role") SELECT "id", "name", "email", "image", "role" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_legs_tourId_order` ON `legs` (`tour_id`,`order`);