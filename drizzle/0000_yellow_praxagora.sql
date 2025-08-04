CREATE TABLE `airports` (
	`icao` text PRIMARY KEY NOT NULL,
	`name` text,
	`country` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `badges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`icon` text
);
--> statement-breakpoint
CREATE TABLE `legs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tour_id` integer NOT NULL,
	`departure_icao` text NOT NULL,
	`arrival_icao` text NOT NULL,
	`description` text,
	`order` integer NOT NULL,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`departure_icao`) REFERENCES `airports`(`icao`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`arrival_icao`) REFERENCES `airports`(`icao`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`user_id` text NOT NULL,
	`badge_id` integer NOT NULL,
	`earned_at` integer DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `badge_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_legs` (
	`user_id` text NOT NULL,
	`leg_id` integer NOT NULL,
	`completed_at` integer DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `leg_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leg_id`) REFERENCES `legs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_tours` (
	`user_id` text NOT NULL,
	`tour_id` integer NOT NULL,
	`completed_at` integer DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`user_id`, `tour_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`image` text
);
