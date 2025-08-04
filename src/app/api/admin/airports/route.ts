// app/api/airports/route.ts
import { db } from '@/db';
import { airportsTable } from '@/db/schema';
import { IcaoSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
   const body = await req.json();
   const { icao, name, country } = body;

   if (!icao || !name || !country) {
      return NextResponse.json(
         { message: 'Campos obrigatórios' },
         { status: 400 },
      );
   }

   const parsed = IcaoSchema.safeParse(icao);

   if (!parsed.success) {
      return NextResponse.json({ message: 'ICAO inválido' }, { status: 400 });
   }

   try {
      await db
         .insert(airportsTable)
         .values({ icao: icao.toUpperCase(), name, country });
      return NextResponse.json({ success: true });
   } catch {
      return NextResponse.json(
         { message: 'Erro ao criar aeroporto' },
         { status: 500 },
      );
   }
}
