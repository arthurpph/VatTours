import { sql } from 'drizzle-orm';
import {
   sqliteTable,
   text,
   integer,
   primaryKey,
   unique,
   check,
   index,
} from 'drizzle-orm/sqlite-core';
import { countryCodes, pirepStatus } from '@/models/types';
import { roleNames } from '@/models/types';

export const usersTable = sqliteTable('users', {
   id: text('id').primaryKey(),
   name: text('name').notNull(),
   email: text('email').notNull().unique(),
   image: text('image'),
   role: text('role', { enum: roleNames }).notNull().default('user'),
});

export const toursTable = sqliteTable('tours', {
   id: integer('id').primaryKey({ autoIncrement: true }),
   title: text('title').notNull(),
   description: text('description'),
   image: text('image').notNull(),
   createdAt: integer('created_at', { mode: 'timestamp' }).default(
      sql`CURRENT_TIMESTAMP`,
   ),
});

export const legsTable = sqliteTable(
   'legs',
   {
      id: integer('id').primaryKey({ autoIncrement: true }),
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

export const airportsTable = sqliteTable('airports', {
   icao: text('icao').primaryKey(),
   name: text('name').notNull(),
   country: text('country', { enum: countryCodes }).notNull(),
});

export const userToursTable = sqliteTable(
   'user_tours',
   {
      userId: text('user_id')
         .notNull()
         .references(() => usersTable.id, { onDelete: 'cascade' }),
      tourId: integer('tour_id')
         .notNull()
         .references(() => toursTable.id, { onDelete: 'cascade' }),
      completedAt: integer('completed_at', { mode: 'timestamp' }).default(
         sql`CURRENT_TIMESTAMP`,
      ),
   },
   (t) => [primaryKey({ columns: [t.userId, t.tourId] })],
);

export const badgesTable = sqliteTable('badges', {
   id: integer('id').primaryKey({ autoIncrement: true }),
   name: text('name').notNull(),
   description: text('description'),
   icon: text('icon'),
});

export const userBadgesTable = sqliteTable(
   'user_badges',
   {
      userId: text('user_id')
         .notNull()
         .references(() => usersTable.id, { onDelete: 'cascade' }),
      badgeId: integer('badge_id')
         .notNull()
         .references(() => badgesTable.id, { onDelete: 'cascade' }),
      earnedAt: integer('earned_at', { mode: 'timestamp' }).default(
         sql`CURRENT_TIMESTAMP`,
      ),
   },
   (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);

export const pirepsTable = sqliteTable(
   'pireps',
   {
      id: integer('id').primaryKey({ autoIncrement: true }),
      userId: text('user_id')
         .notNull()
         .references(() => usersTable.id),
      legId: integer('leg_id')
         .notNull()
         .references(() => legsTable.id, { onDelete: 'cascade' }),
      submittedAt: integer('submitted_at', { mode: 'timestamp' })
         .notNull()
         .default(sql`CURRENT_TIMESTAMP`),
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
      reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
      reviewNote: text('review_note'),
      logbookUrl: text('logbook_url'),
   },
   (t) => [
      index('idx_pireps_legId').on(t.legId),
      index('idx_pireps_userId_legId').on(t.userId, t.legId),
      index('idx_pireps_userId_status').on(t.userId, t.status),
      check(
         'callsign_length_and_format',
         sql`length(${t.callsign}) <= 7 AND ${t.callsign} GLOB '[A-Za-z0-9]*'`,
      ),
      check('comment_length', sql`length(coalesce(${t.comment}, '')) <= 100`),
      check(
         'review_note_length',
         sql`length(coalesce(${t.reviewNote}, '')) <= 100`,
      ),
   ],
);
