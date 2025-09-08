import { insertAirport } from '@/lib/db/queries';
import { IcaoSchema } from '@/lib/validation';
import {
   handleApiError,
   validateAdminPermission,
} from '@/lib/validation/api-validator';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/auth';

export async function POST(req: Request) {
   const session = await getServerSession(authOptions);
   validateAdminPermission(session);
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
      await insertAirport({ icao: icao.toUpperCase(), name, country });
      return NextResponse.json({ success: true });
   } catch (error) {
      return handleApiError(error);
   }
}
