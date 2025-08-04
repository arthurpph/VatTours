import {
   getNextLegForUser,
   getPirepsByUserAndStatus,
   insertPirep,
} from '@/lib/db/queries';
import { PirepSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import z from 'zod';

export async function GET(req: Request) {
   const session = await getServerSession();

   if (!session) {
      return NextResponse.json(
         { message: 'Usuário não autenticado' },
         { status: 401 },
      );
   }

   const { searchParams } = new URL(req.url);
   const status = searchParams.get('status');

   try {
      const pireps = await getPirepsByUserAndStatus(
         session.id,
         status ?? undefined,
      );
      return NextResponse.json(pireps);
   } catch (err) {
      console.error(err);
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

      const tourIdParse = z.number().int().nonnegative().safeParse(tourId);

      if (!tourIdParse.success) {
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
               errors: formattedErrors,
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

      return NextResponse.json(null, { status: 201 });
   } catch (err) {
      console.error(err);
      return NextResponse.json(
         { message: 'Erro interno do servidor' },
         { status: 500 },
      );
   }
}
