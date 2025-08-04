CREATE TABLE "airports" (
	"icao" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text
);
--> statement-breakpoint
CREATE TABLE "legs" (
	"id" serial PRIMARY KEY NOT NULL,
	"tour_id" integer NOT NULL,
	"departure_icao" text NOT NULL,
	"arrival_icao" text NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	CONSTRAINT "legs_tour_id_order_unique" UNIQUE("tour_id","order")
);
--> statement-breakpoint
CREATE TABLE "pireps" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"leg_id" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"callsign" text NOT NULL,
	"comment" text,
	"reviewer_id" text,
	"reviewed_at" timestamp,
	"review_note" text,
	"logbook_url" text,
	CONSTRAINT "callsign_length_and_format" CHECK (length("pireps"."callsign") <= 7 AND "pireps"."callsign" ~ '^[A-Za-z0-9]*$'),
	CONSTRAINT "comment_length" CHECK (length(coalesce("pireps"."comment", '')) <= 100),
	CONSTRAINT "review_note_length" CHECK (length(coalesce("pireps"."review_note", '')) <= 100)
);
--> statement-breakpoint
CREATE TABLE "tours" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"user_id" text NOT NULL,
	"badge_id" integer NOT NULL,
	"earned_at" timestamp DEFAULT now(),
	CONSTRAINT "user_badges_user_id_badge_id_pk" PRIMARY KEY("user_id","badge_id")
);
--> statement-breakpoint
CREATE TABLE "user_tours" (
	"user_id" text NOT NULL,
	"tour_id" integer NOT NULL,
	"completed_at" timestamp DEFAULT now(),
	CONSTRAINT "user_tours_user_id_tour_id_pk" PRIMARY KEY("user_id","tour_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "legs" ADD CONSTRAINT "legs_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legs" ADD CONSTRAINT "legs_departure_icao_airports_icao_fk" FOREIGN KEY ("departure_icao") REFERENCES "public"."airports"("icao") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legs" ADD CONSTRAINT "legs_arrival_icao_airports_icao_fk" FOREIGN KEY ("arrival_icao") REFERENCES "public"."airports"("icao") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "pireps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "pireps_leg_id_legs_id_fk" FOREIGN KEY ("leg_id") REFERENCES "public"."legs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pireps" ADD CONSTRAINT "pireps_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tours" ADD CONSTRAINT "user_tours_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tours" ADD CONSTRAINT "user_tours_tour_id_tours_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tours"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pireps_legId" ON "pireps" USING btree ("leg_id");--> statement-breakpoint
CREATE INDEX "idx_pireps_userId_legId" ON "pireps" USING btree ("user_id","leg_id");--> statement-breakpoint
CREATE INDEX "idx_pireps_userId_status" ON "pireps" USING btree ("user_id","status");