import { db } from '@/db';
import { legsTable, toursTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const tours = await db.select().from(toursTable);

      const tourIds = tours.map((t) => t.id);
      const legs = await db
         .select()
         .from(legsTable)
         .where(
            tourIds.length > 0 ? eq(legsTable.tourId, tourIds[0]) : undefined,
         );

      if (tourIds.length > 1) {
         const { inArray } = await import('drizzle-orm');
         const allLegs = await db
            .select()
            .from(legsTable)
            .where(inArray(legsTable.tourId, tourIds));
         legs.splice(0, legs.length, ...allLegs);
      }

      const toursWithLegs = tours.map((tour) => ({
         ...tour,
         legs: legs.filter((leg) => leg.tourId === tour.id),
      }));

      return NextResponse.json(toursWithLegs);
   } catch (err) {
      return NextResponse.json(
         { message: 'Erro interno do servidor.' },
         { status: 500 },
      );
   }
}
