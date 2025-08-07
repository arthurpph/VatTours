import { getLegsByTourIds, getTours } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
   try {
      const url = new URL(req.url);
      const idParam = url.pathname.split('/').pop();
      const id = Number(idParam);

      if (isNaN(id)) {
         return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
      }

      const tours = await getTours();
      const tour = tours.find((t) => t.id === id);

      if (!tour) {
         return NextResponse.json(
            { message: 'Tour não encontrado' },
            { status: 404 },
         );
      }

      const legs = await getLegsByTourIds([id]);
      const tourWithLegs = {
         ...tour,
         legs: legs.filter((leg) => leg.tourId === tour.id),
      };

      return NextResponse.json(tourWithLegs);
   } catch (err) {
      console.error(err);
      return NextResponse.json(
         { message: 'Erro interno do servidor.' },
         { status: 500 },
      );
   }
}
