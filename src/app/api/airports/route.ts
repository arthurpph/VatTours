import { getAirports } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const airports = await getAirports();
      return NextResponse.json(airports);
   } catch (err) {
      console.error(err);
      return NextResponse.json(
         { message: 'Erro interno do servidor' },
         { status: 500 },
      );
   }
}
