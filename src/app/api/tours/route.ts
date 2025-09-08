import { getLegsByTourIds, getTours } from '@/lib/db/queries';
import { NextResponse, NextRequest } from 'next/server';
import { validateQuery, handleApiError } from '@/lib/validation/api-validator';
import { getToursSchema } from '@/lib/validation/api-schemas';

export async function GET(req: NextRequest) {
   try {
      const { searchParams } = new URL(req.url);
      validateQuery(getToursSchema, searchParams);

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
   } catch (error) {
      return handleApiError(error);
   }
}
