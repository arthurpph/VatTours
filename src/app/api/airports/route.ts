import { db } from '@/db';
import { airportsTable } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
   const airports = await db.select().from(airportsTable);
   return NextResponse.json(airports);
}
