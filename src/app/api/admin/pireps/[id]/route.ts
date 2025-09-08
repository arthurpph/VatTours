import { db } from '@/lib/db';
import { legsTable, pirepsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { PirepStatus } from '@/models/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import {
   handleApiError,
   validateAdminPermission,
} from '@/lib/validation/api-validator';
import { getTotalAndCompletedLegs, insertUserBadge } from '@/lib/db/queries';

function isValidPirepStatus(
   value: string,
): value is Exclude<PirepStatus, 'pending'> {
   return value === 'approved' || value === 'rejected';
}

export async function PATCH(
   req: NextRequest,
   { params }: { params: Promise<{ id: string }> },
) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);
      const { id } = await params;
      const pirepId = Number(id);

      if (isNaN(pirepId)) {
         return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
      }

      if (!session || !session.id) {
         return NextResponse.json(
            { message: 'Sessão inválida' },
            { status: 401 },
         );
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

      const legResult = await db
         .select()
         .from(legsTable)
         .where(eq(legsTable.id, result[0].legId));

      if (legResult.length === 0) {
         return;
      }

      const { totalLegs, completedLegs } = await getTotalAndCompletedLegs(
         legResult[0].tourId,
         result[0].userId,
      );

      if (totalLegs > 0 && totalLegs === completedLegs) {
         await insertUserBadge(legResult[0].tourId, result[0].userId);
      }

      return NextResponse.json({ success: true, pirep: result[0] });
   } catch (error) {
      return handleApiError(error);
   }
}
