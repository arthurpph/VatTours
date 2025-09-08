import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { db } from '@/lib/db';
import { badgesTable } from '@/lib/db/schema';
import { insertBadge } from '@/lib/db/queries';
import {
   handleApiError,
   validateAdminPermission,
   validateJson,
} from '@/lib/validation/api-validator';
import { createBadgeSchema } from '@/lib/validation/api-schemas';

export async function GET() {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);
      const badges = await db.select().from(badgesTable);
      return NextResponse.json(badges);
   } catch (error) {
      return handleApiError(error);
   }
}

export async function POST(req: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      validateAdminPermission(session);

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

      const insertedBadge = await insertBadge({
         name: name,
         description: description || null,
         image: imageBuffer,
      });

      if (!insertedBadge) {
         return NextResponse.json(
            { message: 'Falha ao criar badge.' },
            { status: 500 },
         );
      }

      return NextResponse.json(insertedBadge, { status: 201 });
   } catch (error) {
      return handleApiError(error);
   }
}
