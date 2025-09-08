import { sql } from 'drizzle-orm';
import {
   pgTable,
   text,
   integer,
   primaryKey,
   unique,
   check,
   index,
   serial,
   timestamp,
} from 'drizzle-orm/pg-core';
import { countryCodes, pirepStatus } from '@/models/types';
import { roleNames } from '@/models/types';

export const usersTable = pgTable('users', {
   id: text('id').primaryKey(),
   name: text('name').notNull(),
   email: text('email').notNull().unique(),
   image: text('image'),
   role: text('role', { enum: roleNames }).notNull().default('user'),
});

export const toursTable = pgTable('tours', {
   id: serial('id').primaryKey(),
   title: text('title').notNull(),
   description: text('description'),
   image: text('image').notNull(),
   createdAt: timestamp('created_at', { withTimezone: false }).defaultNow(),
});

export const legsTable = pgTable(
   'legs',
   {
      id: serial('id').primaryKey(),
      tourId: integer('tour_id')
         .notNull()
         .references(() => toursTable.id, { onDelete: 'cascade' }),
      departureIcao: text('departure_icao')
         .notNull()
         .references(() => airportsTable.icao, { onDelete: 'restrict' }),
      arrivalIcao: text('arrival_icao')
         .notNull()
         .references(() => airportsTable.icao, { onDelete: 'restrict' }),
      description: text('description'),
      order: integer('order').notNull(),
   },
   (t) => [unique().on(t.tourId, t.order)],
);

export const airportsTable = pgTable('airports', {
   icao: text('icao').primaryKey(),
   name: text('name').notNull(),
   country: text('country', { enum: countryCodes }).notNull(),
});

export const userToursTable = pgTable(
   'user_tours',
   {
      userId: text('user_id')
         .notNull()
         .references(() => usersTable.id, { onDelete: 'cascade' }),
      tourId: integer('tour_id')
         .notNull()
         .references(() => toursTable.id, { onDelete: 'cascade' }),
      completedAt: timestamp('completed_at', {
         withTimezone: false,
      }).defaultNow(),
   },
   (t) => [primaryKey({ columns: [t.userId, t.tourId] })],
);

export const badgesTable = pgTable('badges', {
   id: serial('id').primaryKey(),
   name: text('name').notNull(),
   description: text('description'),
   image: text('image').notNull(),
});

export const userBadgesTable = pgTable(
   'user_badges',
   {
      userId: text('user_id')
         .notNull()
         .references(() => usersTable.id, { onDelete: 'cascade' }),
      badgeId: integer('badge_id')
         .notNull()
         .references(() => badgesTable.id, { onDelete: 'cascade' }),
      earnedAt: timestamp('earned_at', { withTimezone: false }).defaultNow(),
   },
   (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);

export const pirepsTable = pgTable(
   'pireps',
   {
      id: serial('id').primaryKey(),
      userId: text('user_id')
         .notNull()
         .references(() => usersTable.id),
      legId: integer('leg_id')
         .notNull()
         .references(() => legsTable.id, { onDelete: 'cascade' }),
      submittedAt: timestamp('submitted_at', { withTimezone: false })
         .notNull()
         .defaultNow(),
      status: text('status', {
         enum: pirepStatus,
      })
         .notNull()
         .default('pending'),
      callsign: text('callsign').notNull(),
      comment: text('comment'),
      reviewerId: text('reviewer_id').references(() => usersTable.id, {
         onDelete: 'set null',
      }),
      reviewedAt: timestamp('reviewed_at', { withTimezone: false }),
      reviewNote: text('review_note'),
      logbookUrl: text('logbook_url'),
   },
   (t) => [
      index('idx_pireps_legId').on(t.legId),
      index('idx_pireps_userId_legId').on(t.userId, t.legId),
      index('idx_pireps_userId_status').on(t.userId, t.status),
      check(
         'callsign_length_and_format',
         sql`length(${t.callsign}) <= 12 AND ${t.callsign} ~ '^[A-Za-z0-9]*$'`,
      ),
      check('comment_length', sql`length(coalesce(${t.comment}, '')) <= 100`),
      check(
         'review_note_length',
         sql`length(coalesce(${t.reviewNote}, '')) <= 100`,
      ),
   ],
);

export const tourBadgesTable = pgTable(
   'tour_badges',
   {
      tourId: integer('tour_id')
         .notNull()
         .references(() => toursTable.id, { onDelete: 'cascade' }),
      badgeId: integer('badge_id')
         .notNull()
         .references(() => badgesTable.id, { onDelete: 'cascade' }),
   },
   (t) => [primaryKey({ columns: [t.tourId, t.badgeId] })],
);
