import { getAirports } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
   const airports = await getAirports();
   return NextResponse.json(airports);
}
