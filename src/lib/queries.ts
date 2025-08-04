import { db } from '@/db';
import {
   airportsTable,
   legsTable,
   pirepsTable,
   toursTable,
   usersTable,
} from '@/db/schema';
import { and, asc, eq, notExists, notInArray, or, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export async function getTours() {
   return await db.select().from(toursTable).execute();
}

export async function getAirports() {
   return await db.select().from(airportsTable).execute();
}

export async function getLegsByTourIds(tourIds: number[]) {
   if (tourIds.length === 0) {
      return [];
   }

   const legs = await db
      .select()
      .from(legsTable)
      .where(inArray(legsTable.tourId, tourIds))
      .execute();

   return legs;
}

export async function getLegsWithAirports(tourId: number) {
   const depAirport = alias(airportsTable, 'depAirport');
   const arrAirport = alias(airportsTable, 'arrAirport');

   const legs = await db
      .select({
         id: legsTable.id,
         departureCountry: depAirport.country,
         departureIcao: legsTable.departureIcao,
         arrivalCountry: arrAirport.country,
         arrivalIcao: legsTable.arrivalIcao,
         description: legsTable.description,
         order: legsTable.order,
      })
      .from(legsTable)
      .innerJoin(depAirport, eq(legsTable.departureIcao, depAirport.icao))
      .innerJoin(arrAirport, eq(legsTable.arrivalIcao, arrAirport.icao))
      .where(eq(legsTable.tourId, tourId))
      .orderBy(asc(legsTable.order));

   return legs;
}

export async function getPirepsByUserAndLegs(userId: string, legIds: number[]) {
   if (legIds.length === 0) return [];

   const pireps = await db
      .select({ legId: pirepsTable.legId, status: pirepsTable.status })
      .from(pirepsTable)
      .where(
         and(
            eq(pirepsTable.userId, userId),
            inArray(pirepsTable.legId, legIds),
         ),
      );

   return pireps;
}

export async function getPirepsByTour(tourId: number) {
   const depAirport = alias(airportsTable, 'depAirport');
   const arrAirport = alias(airportsTable, 'arrAirport');

   const pireps = await db
      .select({
         id: pirepsTable.id,
         callsign: pirepsTable.callsign,
         comment: pirepsTable.comment,
         reviewerNote: pirepsTable.reviewNote,
         status: pirepsTable.status,
         submittedAt: pirepsTable.submittedAt,
         departureCountry: depAirport.country,
         departureName: depAirport.name,
         departureIcao: legsTable.departureIcao,
         arrivalCountry: arrAirport.country,
         arrivalName: arrAirport.name,
         arrivalIcao: legsTable.arrivalIcao,
         userId: usersTable.id,
         userName: usersTable.name,
         userEmail: usersTable.email,
      })
      .from(pirepsTable)
      .innerJoin(legsTable, eq(pirepsTable.legId, legsTable.id))
      .innerJoin(usersTable, eq(pirepsTable.userId, usersTable.id))
      .innerJoin(depAirport, eq(legsTable.departureIcao, depAirport.icao))
      .innerJoin(arrAirport, eq(legsTable.arrivalIcao, arrAirport.icao))
      .where(eq(legsTable.tourId, tourId));

   return pireps;
}

type NextLegForUserResult = {
   id: number;
   tourId: number;
   departureIcao: string;
   arrivalIcao: string;
   description: string | null;
   order: number;
};

export async function getNextLegForUser(
   userId: string,
   tourId: number,
): Promise<NextLegForUserResult | undefined> {
   const subqueryCompletedOrPending = db
      .select({ legId: pirepsTable.legId })
      .from(pirepsTable)
      .where(
         and(
            eq(pirepsTable.userId, userId),
            or(
               eq(pirepsTable.status, 'approved'),
               eq(pirepsTable.status, 'pending'),
            ),
         ),
      );

   const subqueryPendingExists = db
      .select({ id: pirepsTable.id })
      .from(pirepsTable)
      .innerJoin(legsTable, eq(pirepsTable.legId, legsTable.id))
      .where(
         and(
            eq(pirepsTable.userId, userId),
            eq(pirepsTable.status, 'pending'),
            eq(legsTable.tourId, tourId),
         ),
      )
      .limit(1);

   const result = await db
      .select({
         id: legsTable.id,
         tourId: legsTable.tourId,
         departureIcao: legsTable.departureIcao,
         arrivalIcao: legsTable.arrivalIcao,
         description: legsTable.description,
         order: legsTable.order,
      })
      .from(legsTable)
      .where(
         and(
            eq(legsTable.tourId, tourId),
            notInArray(legsTable.id, subqueryCompletedOrPending),
            notExists(subqueryPendingExists),
         ),
      )
      .orderBy(asc(legsTable.order))
      .limit(1)
      .execute();

   return result[0] as NextLegForUserResult | undefined;
}

export async function getUserById(userId: string) {
   const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .execute();

   return user[0];
}
