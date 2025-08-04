import { db } from '@/lib/db';
import { legsTable, toursTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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
