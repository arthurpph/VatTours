import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { searchUsers } from '@/lib/db/queries';
import {
   handleApiError,
   validateAuthSession,
} from '@/lib/validation/api-validator';

export async function GET(req: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      validateAuthSession(session);

      const { searchParams } = new URL(req.url);
      const query = searchParams.get('q');

      if (!query || query.trim().length < 2) {
         return NextResponse.json([]);
      }

      const users = await searchUsers(query.trim());
      return NextResponse.json(users);
   } catch (error) {
      return handleApiError(error);
   }
}
