import { db } from '@/db';
import { legsTable, pirepsTable } from '@/db/schema';
import { and, asc, eq, notExists, notInArray, or } from 'drizzle-orm';

type LegResult = {
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
): Promise<LegResult | undefined> {
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

   return result[0] as LegResult | undefined;
}
