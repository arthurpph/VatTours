import { getAirports } from '@/lib/db/queries';
import { NextResponse, NextRequest } from 'next/server';
import { validateQuery, handleApiError } from '@/lib/validation/api-validator';
import { getAirportsSchema } from '@/lib/validation/api-schemas';

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      validateQuery(getAirportsSchema, searchParams);

      const airports = await getAirports();
      return NextResponse.json(airports);
   } catch (error) {
      return handleApiError(error);
   }
}
