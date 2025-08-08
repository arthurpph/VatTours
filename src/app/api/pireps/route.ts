import {
   getNextLegForUser,
   getPirepsByUserAndStatus,
   insertPirep,
} from '@/lib/db/queries';
import { PirepSchema } from '@/lib/validation';
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import {
   validateQuery,
   validateJson,
   validateAuthSession,
   handleApiError,
} from '@/lib/validation/api-validator';
import {
   getPirepsSchema,
   createPirepSchema,
} from '@/lib/validation/api-schemas';

export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      validateAuthSession(session);

      const { searchParams } = new URL(request.url);
      const query = validateQuery(getPirepsSchema, searchParams);

      const pireps = await getPirepsByUserAndStatus(
         session!.id,
         query.status !== 'all' ? query.status : undefined,
      );
      return NextResponse.json(pireps);
   } catch (error) {
      return handleApiError(error);
   }
}

export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      validateAuthSession(session);

      const body = await request.json();
      const validatedData = validateJson(createPirepSchema, body);

      const userId = session!.id;

      const nextLegPirepResult = await getNextLegForUser(
         userId,
         validatedData.tourId,
      );

      if (!nextLegPirepResult) {
         return NextResponse.json(
            {
               message:
                  'Você não pode enviar um PIREP para este tour. Tente novamente mais tarde.',
            },
            { status: 400 },
         );
      }

      const legId = nextLegPirepResult.id;

      const pirepData = {
         userId,
         legId,
         callsign: validatedData.callsign,
         comment: validatedData.comment,
      };

      const parser = PirepSchema.safeParse(pirepData);

      if (!parser.success) {
         return NextResponse.json(
            {
               message: 'Dados inválidos',
               errors: parser.error.format(),
            },
            { status: 400 },
         );
      }

      await insertPirep({
         userId,
         legId,
         callsign: validatedData.callsign,
         comment: validatedData.comment || null,
      });

      return NextResponse.json(null, { status: 201 });
   } catch (error) {
      return handleApiError(error);
   }
}
