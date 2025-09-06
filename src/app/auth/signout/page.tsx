'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
   const { status } = useSession();

   useEffect(() => {
      if (status === 'authenticated') {
         signOut({ callbackUrl: '/auth/signin' });
      }
   }, [status]);

   return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
         <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#21262d]">
               <svg
                  className="h-8 w-8 animate-spin text-[#7d8590]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
               </svg>
            </div>
            <p className="text-lg font-medium text-[#f0f6fc]">
               Encerrando sessão...
            </p>
            <p className="mt-2 text-sm text-[#7d8590]">
               Aguarde enquanto redirecionamos você
            </p>
         </div>
      </div>
   );
}
