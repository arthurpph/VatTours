import { z } from 'zod';
import { countryCodes, pirepStatus } from '@/models/types';
import { roleNames } from '@/models/types';

export const UserSchema = z.object({
   id: z.string(),
   name: z.string().min(1),
   email: z.email(),
   image: z.url().optional(),
   role: z.enum(roleNames),
});

export const TourSchema = z.object({
   id: z.number().int().nonnegative().optional(),
   title: z.string().min(1),
   description: z.string().optional(),
   image: z.url(),
   createdAt: z.date().optional(),
});

export const LegSchema = z.object({
   id: z.number().int().nonnegative().optional(),
   tourId: z.number().int().nonnegative(),
   departureIcao: z.string().length(4),
   arrivalIcao: z.string().length(4),
   description: z.string().optional(),
   order: z.number().int().nonnegative(),
});

export const AirportSchema = z.object({
   icao: z
      .string()
      .length(4)
      .regex(/^[A-Z0-9]+$/),
   name: z.string().min(1),
   country: z.enum(countryCodes),
});

export const UserTourSchema = z.object({
   userId: z.string(),
   tourId: z.number().int().nonnegative(),
   completedAt: z.date().optional(),
});

export const BadgeSchema = z.object({
   id: z.number().int().optional(),
   name: z.string().min(1),
   description: z.string().optional(),
   icon: z.url().optional(),
});

export const UserBadgeSchema = z.object({
   userId: z.string(),
   badgeId: z.number().int().nonnegative(),
   earnedAt: z.date().optional(),
});

export const PirepSchema = z.object({
   id: z.number().int().optional(),
   userId: z.string(),
   legId: z.number().int(),
   submittedAt: z.date().optional(),
   status: z.enum(pirepStatus).optional(),
   callsign: z.string().min(1).max(12),
   comment: z.string().optional().nullable(),
   reviewerId: z.string().optional(),
   reviewedAt: z.date().optional(),
   reviewNote: z.string().optional(),
   logbookUrl: z.url().optional(),
});
