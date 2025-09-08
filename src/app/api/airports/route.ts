import { getAirports } from '@/lib/db/queries';
import { NextResponse, NextRequest } from 'next/server';
import { validateQuery, handleApiError } from '@/lib/validation/api-validator';
import { getAirportsSchema } from '@/lib/validation/api-schemas';

export async function GET(req: NextRequest) {
   try {
      const { searchParams } = new URL(req.url);
      validateQuery(getAirportsSchema, searchParams);

      const airports = await getAirports();
      return NextResponse.json(airports);
   } catch (error) {
      return handleApiError(error);
   }
}
