import { db } from '@/lib/db';
import { pirepsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { PirepStatus } from '@/models/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

function isValidPirepStatus(
   value: string,
): value is Exclude<PirepStatus, 'pending'> {
   return value === 'approved' || value === 'rejected';
}

export async function PATCH(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   const session = await getServerSession(authOptions);
   const { id } = await params;
   const pirepId = Number(id);

   if (isNaN(pirepId)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
   }

   if (!session || !session.id) {
      return NextResponse.json({ message: 'Sessão inválida' }, { status: 401 });
   }

   const body = await req.json();
   const {
      status,
      review_note,
   }: { status?: string; review_note: string | null } = body;

   if (!status || !isValidPirepStatus(status)) {
      return NextResponse.json(
         { message: 'Status inválido. Use "approved" ou "rejected".' },
         { status: 400 },
      );
   }

   try {
      const result = await db
         .update(pirepsTable)
         .set({
            status,
            reviewerId: session.id,
            reviewedAt: new Date(),
            reviewNote: review_note || null,
         })
         .where(eq(pirepsTable.id, pirepId))
         .returning();

      if (result.length === 0) {
         return NextResponse.json(
            { message: 'PIREP não encontrado' },
            { status: 404 },
         );
      }

      return NextResponse.json({ success: true, pirep: result[0] });
   } catch {
      return NextResponse.json(
         { message: 'Erro interno ao atualizar PIREP' },
         { status: 500 },
      );
   }
}
