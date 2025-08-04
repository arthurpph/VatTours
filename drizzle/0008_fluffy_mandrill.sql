DROP INDEX `idx_legs_tourId_order`;--> statement-breakpoint
DROP INDEX `pireps_user_id_leg_id_unique`;--> statement-breakpoint
CREATE INDEX `idx_pireps_userId_legId` ON `pireps` (`user_id`,`leg_id`);