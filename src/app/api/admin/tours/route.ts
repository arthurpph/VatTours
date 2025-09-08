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

export async function POST(req: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);

      const formData = await req.formData();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const image = formData.get('image') as File | null;
      const legsString = formData.get('legs') as string;

      validateJson(createTourSchema, {
         title,
         description,
         image: image ? 'temp' : undefined,
      });

      let legs;
      try {
         legs = JSON.parse(legsString || '[]');
      } catch {
         return NextResponse.json(
            { message: 'Formato inválido para legs.' },
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
               {
                  message: `Leg ${index + 1} inválida`,
                  issues: result.error.format(),
               },
               { status: 400 },
            );
         }

         validatedLegs.push(result.data);
      }

      let imageBuffer: Buffer | null = null;
      if (image && image.size > 0) {
         if (!image.type.startsWith('image/')) {
            return NextResponse.json(
               { message: 'Apenas arquivos de imagem são permitidos.' },
               { status: 400 },
            );
         }

         if (image.size > 5 * 1024 * 1024) {
            return NextResponse.json(
               { message: 'Arquivo muito grande. Máximo 5MB.' },
               { status: 400 },
            );
         }

         const bytes = await image.arrayBuffer();
         imageBuffer = Buffer.from(bytes);
      }

      const insertedTour = await insertTour({
         title: title,
         description,
         image: imageBuffer,
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
