import { getLegsByTourIds, getTours } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const tours = await getTours();

      const tourIds = tours.map((t) => t.id);
      const legs = await getLegsByTourIds(tourIds);

      if (tourIds.length > 1) {
         const allLegs = await getLegsByTourIds(tourIds);
         legs.splice(0, legs.length, ...allLegs);
      }

      const toursWithLegs = tours.map((tour) => ({
         ...tour,
         legs: legs.filter((leg) => leg.tourId === tour.id),
      }));

      return NextResponse.json(toursWithLegs);
   } catch {
      return NextResponse.json(
         { message: 'Erro interno do servidor.' },
         { status: 500 },
      );
   }
}
