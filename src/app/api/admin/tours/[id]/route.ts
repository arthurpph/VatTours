import { db } from '@/lib/db';
import { legsTable, toursTable, airportsTable } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { LegSchema } from '@/lib/validation';
import { insertLegs } from '@/lib/db/queries';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth';
import {
   validateJson,
   validateAdminPermission,
   handleApiError,
} from '@/lib/validation/api-validator';
import { createTourSchema } from '@/lib/validation/api-schemas';

export async function PUT(req: Request) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);

      const url = new URL(req.url);
      const idParam = url.pathname.split('/').pop();
      const id = Number(idParam);

      if (isNaN(id)) {
         return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
      }

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
            tourId: id,
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

      const existingTour = await db
         .select()
         .from(toursTable)
         .where(eq(toursTable.id, id))
         .limit(1);

      if (existingTour.length === 0) {
         return NextResponse.json(
            { message: 'Tour não encontrado' },
            { status: 404 },
         );
      }

      let finalImage = existingTour[0].image;
      if (imageBuffer) {
         finalImage = imageBuffer.toString('base64');
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

      await db
         .update(toursTable)
         .set({
            title,
            description,
            image: finalImage,
         })
         .where(eq(toursTable.id, id));

      await db.delete(legsTable).where(eq(legsTable.tourId, id));

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
            tourId: id,
         }),
      );

      await insertLegs(legsToInsert);

      return NextResponse.json({ success: true });
   } catch (error) {
      return handleApiError(error);
   }
}

export async function DELETE(req: Request) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);
      const url = new URL(req.url);
      const idParam = url.pathname.split('/').pop();
      const id = Number(idParam);

      if (isNaN(id)) {
         return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
      }

      const tourExists = await db
         .select()
         .from(toursTable)
         .where(eq(toursTable.id, id))
         .limit(1);

      if (tourExists.length === 0) {
         return NextResponse.json(
            { message: 'Tour não encontrado' },
            { status: 404 },
         );
      }

      await db.delete(legsTable).where(eq(legsTable.tourId, id));
      await db.delete(toursTable).where(eq(toursTable.id, id));

      return NextResponse.json({ success: true });
   } catch (error) {
      return handleApiError(error);
   }
}
