import { db } from '@/lib/db';
import {
   pirepsTable,
   usersTable,
   legsTable,
   toursTable,
} from '@/lib/db/schema';
import { getNextLegForUser, insertPirep } from '@/lib/db/queries';
import { PirepSchema } from '@/lib/validation';
import { PirepStatus, pirepStatus } from '@/models/types';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import z from 'zod';

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
      const { tourId, callsign, comment } = await req.json();
      const session = await getServerSession();

      if (!session) {
         return NextResponse.json(
            { message: 'Usuário não autenticado' },
            { status: 401 },
         );
      }

      if (!tourId || isNaN(tourId)) {
         return NextResponse.json(
            { message: 'Tour ID inválido' },
            { status: 400 },
         );
      }

      const userId = session.id;

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

      if (!parser.success) {
         const formattedErrors = z.treeifyError(parser.error);

         return NextResponse.json(
            {
               message: 'Dados inválidos',
               errors: parser.success ? undefined : formattedErrors,
            },
            { status: 400 },
         );
      }

      await insertPirep({
         userId,
         legId,
         callsign,
         comment: comment || null,
      });

      return NextResponse.json({ success: true });
   } catch (err) {
      return NextResponse.json(
         { message: 'Erro interno do servidor' },
         { status: 500 },
      );
   }
}
