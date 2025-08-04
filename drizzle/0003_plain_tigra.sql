PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_airports` (
	`icao` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`country` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_airports`("icao", "name", "country") SELECT "icao", "name", "country" FROM `airports`;--> statement-breakpoint
DROP TABLE `airports`;--> statement-breakpoint
ALTER TABLE `__new_airports` RENAME TO `airports`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`image` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_tours`("id", "title", "description", "image", "created_at") SELECT "id", "title", "description", "image", "created_at" FROM `tours`;--> statement-breakpoint
DROP TABLE `tours`;--> statement-breakpoint
ALTER TABLE `__new_tours` RENAME TO `tours`;--> statement-breakpoint
ALTER TABLE `pireps` ADD `callsign` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `legs_tour_id_order_unique` ON `legs` (`tour_id`,`order`);