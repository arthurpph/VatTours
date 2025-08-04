PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_legs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tour_id` integer NOT NULL,
	`departure_icao` text NOT NULL,
	`arrival_icao` text NOT NULL,
	`description` text,
	`order` integer NOT NULL,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`departure_icao`) REFERENCES `airports`(`icao`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`arrival_icao`) REFERENCES `airports`(`icao`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_legs`("id", "tour_id", "departure_icao", "arrival_icao", "description", "order") SELECT "id", "tour_id", "departure_icao", "arrival_icao", "description", "order" FROM `legs`;--> statement-breakpoint
DROP TABLE `legs`;--> statement-breakpoint
ALTER TABLE `__new_legs` RENAME TO `legs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `legs_tour_id_order_unique` ON `legs` (`tour_id`,`order`);--> statement-breakpoint
CREATE TABLE `__new_pireps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`leg_id` integer NOT NULL,
	`submitted_at` integer DEFAULT CURRENT_TIMESTAMP,
	`status` text DEFAULT 'pending' NOT NULL,
	`callsign` text NOT NULL,
	`comment` text,
	`reviewer_id` text,
	`reviewed_at` integer,
	`review_note` text,
	`logbook_url` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leg_id`) REFERENCES `legs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_pireps`("id", "user_id", "leg_id", "submitted_at", "status", "callsign", "comment", "reviewer_id", "reviewed_at", "review_note", "logbook_url") SELECT "id", "user_id", "leg_id", "submitted_at", "status", "callsign", "comment", "reviewer_id", "reviewed_at", "review_note", "logbook_url" FROM `pireps`;--> statement-breakpoint
DROP TABLE `pireps`;--> statement-breakpoint
ALTER TABLE `__new_pireps` RENAME TO `pireps`;--> statement-breakpoint
CREATE TABLE `__new_user_badges` (
	`user_id` text NOT NULL,
	`badge_id` integer NOT NULL,
	`earned_at` integer DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `badge_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_badges`("user_id", "badge_id", "earned_at") SELECT "user_id", "badge_id", "earned_at" FROM `user_badges`;--> statement-breakpoint
DROP TABLE `user_badges`;--> statement-breakpoint
ALTER TABLE `__new_user_badges` RENAME TO `user_badges`;--> statement-breakpoint
CREATE TABLE `__new_user_tours` (
	`user_id` text NOT NULL,
	`tour_id` integer NOT NULL,
	`completed_at` integer DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `tour_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_tours`("user_id", "tour_id", "completed_at") SELECT "user_id", "tour_id", "completed_at" FROM `user_tours`;--> statement-breakpoint
DROP TABLE `user_tours`;--> statement-breakpoint
ALTER TABLE `__new_user_tours` RENAME TO `user_tours`;