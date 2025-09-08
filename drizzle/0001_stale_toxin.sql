CREATE TABLE "tour_badges" (
	"tour_id" integer NOT NULL,
	"badge_id" integer NOT NULL,
	CONSTRAINT "tour_badges_tour_id_badge_id_pk" PRIMARY KEY("tour_id","badge_id")
);
--> statement-breakpoint
ALTER TABLE "pireps" DROP CONSTRAINT "callsign_length_and_format";--> statement-breakpoint
ALTER TABLE "badges" ALTER COLUMN "icon" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tour_badges" ADD CONSTRAINT "tour_badges_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tour_badges" ADD CONSTRAINT "tour_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "callsign_length_and_format" CHECK (length("pireps"."callsign") <= 12 AND "pireps"."callsign" ~ '^[A-Za-z0-9]*$');