CREATE TABLE `pireps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`leg_id` integer NOT NULL,
	`submitted_at` integer DEFAULT CURRENT_TIMESTAMP,
	`status` text DEFAULT 'pending' NOT NULL,
	`comment` text,
	`reviewer_id` text,
	`reviewed_at` integer,
	`review_note` text,
	`logbook_url` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leg_id`) REFERENCES `legs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `user_legs`;