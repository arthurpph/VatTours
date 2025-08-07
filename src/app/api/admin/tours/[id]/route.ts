import { db } from '@/lib/db';
import { legsTable, toursTable, airportsTable } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { LegSchema, TourSchema } from '@/lib/validation';
import { insertLegs } from '@/lib/db/queries';

export async function PUT(req: Request) {
   try {
      const url = new URL(req.url);
      const idParam = url.pathname.split('/').pop();
      const id = Number(idParam);

      if (isNaN(id)) {
         return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
      }

      const body = await req.json();
      const { title, description, image, legs } = body;

      // Validar tour
      const tourValidation = TourSchema.safeParse({
         title,
         description,
         image,
      });
      if (!tourValidation.success) {
         return NextResponse.json(
            { message: 'Dados do tour inválidos.' },
            { status: 400 },
         );
      }

      // Validar legs
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

      // Verificar se o tour existe
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

      // Verificar se todos os aeroportos existem
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

      // Atualizar o tour
      await db
         .update(toursTable)
         .set({
            title,
            description,
            image,
         })
         .where(eq(toursTable.id, id));

      // Remover legs antigas
      await db.delete(legsTable).where(eq(legsTable.tourId, id));

      // Inserir novas legs
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
   } catch (err) {
      console.error('Erro ao atualizar tour:', err);
      return NextResponse.json(
         { message: 'Erro interno do servidor.' },
         { status: 500 },
      );
   }
}

export async function DELETE(req: Request) {
   try {
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
   } catch {
      return NextResponse.json(
         { message: 'Erro interno do servidor.' },
         { status: 500 },
      );
   }
}
