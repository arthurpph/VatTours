import { db } from '@/db';
import { pirepsTable, usersTable, legsTable, toursTable } from '@/db/schema';
import { getNextLegForUser } from '@/lib/queries';
import { PirepSchema } from '@/lib/validation';
import { PirepStatus, pirepStatus } from '@/models/types';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
   const { searchParams } = new URL(req.url);
   const status = searchParams.get('status');

   try {
      const query = db
         .select({
            id: pirepsTable.id,
            userId: usersTable.id,
            userName: usersTable.name,
            legId: legsTable.id,
            callsign: pirepsTable.callsign,
            comment: pirepsTable.comment,
            tourTitle: toursTable.title,
            departureIcao: legsTable.departureIcao,
            arrivalIcao: legsTable.arrivalIcao,
            status: pirepsTable.status,
         })
         .from(pirepsTable)
         .innerJoin(usersTable, eq(usersTable.id, pirepsTable.userId))
         .innerJoin(legsTable, eq(legsTable.id, pirepsTable.legId))
         .innerJoin(toursTable, eq(toursTable.id, legsTable.tourId));

      if (status && pirepStatus.includes(status as PirepStatus)) {
         query.where(eq(pirepsTable.status, status as PirepStatus));
      }

      const result = await query.execute();
      return NextResponse.json(result);
   } catch {
      return NextResponse.json(
         { message: 'Erro ao buscar PIREPs' },
         { status: 500 },
      );
   }
}

export async function POST(req: Request) {
   try {
      const { userId, tourId, callsign, comment } = await req.json();

      const nextLegPirepResult = await getNextLegForUser(
         userId,
         Number(tourId),
      );

      if (!nextLegPirepResult) {
         return NextResponse.json(
            {
               message:
                  'Você não pode enviar um PIREP para este tour. Tente novamente mais tarde.',
            },
            { status: 400 },
         );
      }

      const legId = nextLegPirepResult.id;

      const parser = PirepSchema.safeParse({
         userId,
         legId,
         callsign,
         comment,
      });

      if (!parser.success || !callsign || !tourId || isNaN(tourId)) {
         return NextResponse.json(
            { message: 'Dados inválidos' },
            { status: 400 },
         );
      }

      await db.insert(pirepsTable).values({
         userId,
         legId,
         callsign,
         comment: comment || null,
      });

      return NextResponse.json({ success: true });
   } catch (err) {
      console.error(err);
      return NextResponse.json(
         { message: 'Erro interno do servidor' },
         { status: 500 },
      );
   }
}
