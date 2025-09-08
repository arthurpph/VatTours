import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { db } from '@/lib/db';
import { airportsTable, legsTable } from '@/lib/db/schema';
import { AirportSchema } from '@/lib/validation';
import {
   handleApiError,
   validateAdminPermission,
} from '@/lib/validation/api-validator';
import { eq, or } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);
      const url = new URL(req.url);
      const icaoParam = url.pathname.split('/').pop();

      const parsed = AirportSchema.safeParse(icaoParam);

      if (!parsed.success) {
         return NextResponse.json(
            { message: 'ICAO inválido' },
            { status: 400 },
         );
      }

      const icao = parsed.data.icao.toUpperCase();

      const airportExists = await db
         .select()
         .from(airportsTable)
         .where(eq(airportsTable.icao, icao))
         .limit(1);

      if (airportExists.length === 0) {
         return NextResponse.json(
            { message: 'Aeroporto não encontrado' },
            { status: 404 },
         );
      }

      const legsWithAirportExists = await db
         .select()
         .from(legsTable)
         .where(
            or(
               eq(legsTable.departureIcao, airportExists[0].icao),
               eq(legsTable.arrivalIcao, airportExists[0].icao),
            ),
         )
         .limit(1);

      if (legsWithAirportExists.length > 0) {
         return NextResponse.json(
            {
               message: 'Aeroporto está vinculado a uma leg existente.',
            },
            { status: 400 },
         );
      }

      await db.delete(airportsTable).where(eq(airportsTable.icao, icao));
      return NextResponse.json({ success: true });
   } catch (error) {
      return handleApiError(error);
   }
}
