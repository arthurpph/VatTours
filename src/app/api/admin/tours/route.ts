import { db } from '@/lib/db';
import { airportsTable } from '@/lib/db/schema';
import { insertLegs, insertTour } from '@/lib/db/queries';
import { LegSchema, TourSchema } from '@/lib/validation';
import { inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
   try {
      const body = await req.json();
      const { title, description, image, legs } = body;

      const tourValidation = TourSchema.safeParse({
         title,
         description,
         image,
      });
      if (!tourValidation.success) {
         return NextResponse.json(
            { message: 'Título e ao menos uma leg são obrigatórios.' },
            { status: 400 },
         );
      }

      if (!Array.isArray(legs) || legs.length === 0) {
         return NextResponse.json(
            { message: 'É necessário pelo menos uma leg.' },
            { status: 400 },
         );
      }

      const validatedLegs = [];
      for (const [index, leg] of legs.entries()) {
         const result = LegSchema.safeParse({
            ...leg,
            tourId: 0,
            order: index + 1,
         });

         if (!result.success) {
            return NextResponse.json(
               { message: `Leg ${index + 1} inválida`, issues: result.error },
               { status: 400 },
            );
         }

         validatedLegs.push(result.data);
      }

      const insertedTour = await insertTour({
         title,
         description,
         image,
         createdAt: new Date(),
      });

      if (!insertedTour) {
         return NextResponse.json(
            { message: 'Falha ao criar tour.' },
            { status: 500 },
         );
      }

      const tourId = insertedTour?.id;
      if (!tourId) {
         return NextResponse.json(
            { message: 'Falha ao criar tour.' },
            { status: 500 },
         );
      }

      const allIcaos = legs
         .flatMap((leg: { departureIcao: string; arrivalIcao: string }) => [
            leg.departureIcao.toUpperCase(),
            leg.arrivalIcao.toUpperCase(),
         ])
         .filter((value, index, self) => self.indexOf(value) === index);
      const existingAirports = await db
         .select()
         .from(airportsTable)
         .where(inArray(airportsTable.icao, allIcaos));

      const existingIcaos = existingAirports.map((a) => a.icao);
      const missingIcaos = allIcaos.filter(
         (icao) => !existingIcaos.includes(icao),
      );
      if (missingIcaos.length > 0) {
         return NextResponse.json(
            {
               message: `Aeroportos não encontrados: ${missingIcaos.join(', ')}`,
            },
            { status: 400 },
         );
      }

      const legsToInsert = legs.map(
         (
            leg: {
               description: string | null;
               departureIcao: string;
               arrivalIcao: string;
            },
            index: number,
         ) => ({
            description: leg.description ?? null,
            departureIcao: leg.departureIcao.toUpperCase(),
            arrivalIcao: leg.arrivalIcao.toUpperCase(),
            order: index + 1,
            tourId,
         }),
      );

      await insertLegs(legsToInsert);

      return NextResponse.json({ success: true, tourId }, { status: 201 });
   } catch (err) {
      console.error('Erro ao criar tour:', err);
      return NextResponse.json(
         { message: 'Erro interno do servidor.' },
         { status: 500 },
      );
   }
}
