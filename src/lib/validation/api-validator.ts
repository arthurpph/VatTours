import { NextResponse } from 'next/server';
import { z } from 'zod';

export class ApiValidationError extends Error {
   constructor(
      public errors: unknown,
      public statusCode: number = 400,
   ) {
      super('Validation failed');
      this.name = 'ApiValidationError';
   }
}

export function validateJson<T>(schema: z.ZodSchema<T>, data: unknown): T {
   const result = schema.safeParse(data);

   if (!result.success) {
      throw new ApiValidationError(result.error.format());
   }

   return result.data;
}

export function validateParams<T>(schema: z.ZodSchema<T>, params: unknown): T {
   const result = schema.safeParse(params);

   if (!result.success) {
      throw new ApiValidationError(result.error.format(), 400);
   }

   return result.data;
}

export function validateQuery<T>(
   schema: z.ZodSchema<T>,
   searchParams: URLSearchParams,
): T {
   const queryObj = Object.fromEntries(searchParams.entries());
   const result = schema.safeParse(queryObj);

   if (!result.success) {
      throw new ApiValidationError(result.error.format(), 400);
   }

   return result.data;
}

export function handleApiError(error: unknown): NextResponse {
   if (error instanceof ApiValidationError) {
      return NextResponse.json(
         {
            message: 'Dados inválidos',
            errors: error.errors,
         },
         { status: error.statusCode },
      );
   }

   if (error instanceof z.ZodError) {
      return NextResponse.json(
         {
            message: 'Dados inválidos',
            errors: error.format(),
         },
         { status: 400 },
      );
   }

   console.error('API Error:', error);

   return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 },
   );
}

// Middleware para validação de autenticação
export function validateAuthSession(session: unknown) {
   if (
      !session ||
      typeof session !== 'object' ||
      !('user' in session) ||
      !session.user
   ) {
      throw new ApiValidationError('Não autorizado', 401);
   }
   return session;
}

// Middleware para validação de permissões de admin
export function validateAdminPermission(session: unknown) {
   validateAuthSession(session);

   if (
      typeof session === 'object' &&
      session &&
      'user' in session &&
      typeof session.user === 'object' &&
      session.user &&
      'role' in session.user &&
      session.user.role !== 'admin'
   ) {
      throw new ApiValidationError(
         'Acesso negado - permissões insuficientes',
         403,
      );
   }
}
