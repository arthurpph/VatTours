import { getLegsByTourIds, getTours } from '@/lib/db/queries';
import { NextResponse } from 'next/server';
import { validateParams, handleApiError } from '@/lib/validation/api-validator';
import { IdParamsSchema, type IdParams } from '@/lib/validation/api-schemas';

export async function GET(
   req: Request,
   { params }: { params: Promise<{ id: string }> },
) {
   try {
      const resolvedParams = await params;
      const validatedParams: IdParams = validateParams(
         IdParamsSchema,
         resolvedParams,
      );
      const id = validatedParams.id;

      const tours = await getTours();
      const tour = tours.find((t) => t.id === id);

      if (!tour) {
         return NextResponse.json(
            { message: 'Tour não encontrado' },
            { status: 404 },
         );
      }

      const legs = await getLegsByTourIds([id]);
      const tourWithLegs = {
         ...tour,
         legs: legs.filter((leg) => leg.tourId === tour.id),
      };

      return NextResponse.json(tourWithLegs);
   } catch (error) {
      return handleApiError(error);
   }
}
