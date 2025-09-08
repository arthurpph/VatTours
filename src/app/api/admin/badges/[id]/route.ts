import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { db } from '@/lib/db';
import { badgesTable } from '@/lib/db/schema';
import { updateBadge } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';
import {
   handleApiError,
   validateAdminPermission,
   validateJson,
} from '@/lib/validation/api-validator';
import { createBadgeSchema } from '@/lib/validation/api-schemas';

type Props = {
   params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: Props) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);

      const { id } = await params;
      const badgeId = parseInt(id);

      if (isNaN(badgeId)) {
         return NextResponse.json(
            { message: 'ID do badge inválido' },
            { status: 400 },
         );
      }

      const formData = await req.formData();
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const image = formData.get('image') as File | null;

      validateJson(createBadgeSchema, {
         name,
         description,
         image: image ? 'temp' : undefined,
      });

      let imageBuffer: Buffer | null = null;
      if (image && image.size > 0) {
         if (!image.type.startsWith('image/')) {
            return NextResponse.json(
               { message: 'Apenas arquivos de imagem são permitidos.' },
               { status: 400 },
            );
         }

         if (image.size > 1 * 1024 * 1024) {
            return NextResponse.json(
               { message: 'Arquivo muito grande. Máximo 1MB.' },
               { status: 400 },
            );
         }

         const bytes = await image.arrayBuffer();
         imageBuffer = Buffer.from(bytes);
      }

      const updatedBadge = await updateBadge(badgeId, {
         name: name,
         description: description || null,
         image: imageBuffer,
      });

      if (!updatedBadge) {
         return NextResponse.json(
            { message: 'Badge não encontrado' },
            { status: 404 },
         );
      }

      return NextResponse.json(updatedBadge);
   } catch (error) {
      return handleApiError(error);
   }
}

export async function DELETE(_: NextRequest, { params }: Props) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);

      const { id } = await params;
      const badgeId = parseInt(id);

      if (isNaN(badgeId)) {
         return NextResponse.json(
            { message: 'ID do badge inválido' },
            { status: 400 },
         );
      }

      const [deletedBadge] = await db
         .delete(badgesTable)
         .where(eq(badgesTable.id, badgeId))
         .returning();

      if (!deletedBadge) {
         return NextResponse.json(
            { message: 'Badge não encontrado' },
            { status: 404 },
         );
      }

      return NextResponse.json({ message: 'Badge excluído com sucesso' });
   } catch (error) {
      return handleApiError(error);
   }
}
