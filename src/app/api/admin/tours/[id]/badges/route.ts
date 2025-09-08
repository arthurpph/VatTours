import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { db } from '@/lib/db';
import { tourBadgesTable } from '@/lib/db/schema';
import { getTourBadges } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import {
   handleApiError,
   validateAdminPermission,
} from '@/lib/validation/api-validator';

type Props = {
   params: Promise<{ id: string }>;
};

const TourBadgesSchema = z.object({
   badgeIds: z.array(z.number()),
});

export async function GET(_: NextRequest, { params }: Props) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);
      const { id } = await params;
      const tourId = parseInt(id);

      if (isNaN(tourId)) {
         return NextResponse.json(
            { message: 'ID do tour inválido' },
            { status: 400 },
         );
      }

      const badges = await getTourBadges(tourId);
      return NextResponse.json(badges);
   } catch (error) {
      return handleApiError(error);
   }
}

export async function PUT(req: NextRequest, { params }: Props) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);

      const { id } = await params;
      const tourId = parseInt(id);

      if (isNaN(tourId)) {
         return NextResponse.json(
            { message: 'ID do tour inválido' },
            { status: 400 },
         );
      }

      const body = await req.json();
      const { badgeIds } = TourBadgesSchema.parse(body);

      await db
         .delete(tourBadgesTable)
         .where(eq(tourBadgesTable.tourId, tourId));

      if (badgeIds.length > 0) {
         await db.insert(tourBadgesTable).values(
            badgeIds.map((badgeId) => ({
               tourId,
               badgeId,
            })),
         );
      }

      return NextResponse.json({
         message: 'Badges do tour atualizados com sucesso',
      });
   } catch (error) {
      return handleApiError(error);
   }
}
