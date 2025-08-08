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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 px-4 py-6">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
            <div className="animate-float absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/10"></div>
         </div>

         <div className="relative text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
               <svg
                  className="h-8 w-8 animate-spin text-white"
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
            <p className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-semibold text-transparent">
               Encerrando sessão...
            </p>
         </div>
      </div>
   );
}
