import { db } from '@/lib/db';
import { airportsTable } from '@/lib/db/schema';
import { insertLegs, insertTour } from '@/lib/db/queries';
import { LegSchema } from '@/lib/validation';
import { inArray } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth';
import {
   validateJson,
   validateAdminPermission,
   handleApiError,
} from '@/lib/validation/api-validator';
import { createTourSchema } from '@/lib/validation/api-schemas';

export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);

      const body = await request.json();
      const validatedData = validateJson(createTourSchema, body);

      const { title, description } = validatedData;
      const { legs } = body; // As legs ainda usam o schema antigo

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
               {
                  message: `Leg ${index + 1} inválida`,
                  issues: result.error.format(),
               },
               { status: 400 },
            );
         }

         validatedLegs.push(result.data);
      }

      const insertedTour = await insertTour({
         title: title,
         description,
         image: '', // String vazia em vez de null
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
   } catch (error) {
      return handleApiError(error);
   }
}
