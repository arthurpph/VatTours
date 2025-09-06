'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SignIn() {
   const { status } = useSession();

   if (status === 'authenticated') {
      return redirect('/');
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
         <div className="w-full max-w-sm">
            <div className="rounded-md border border-[#21262d] bg-[#010409] p-8">
               <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#21262d]">
                     <svg
                        className="h-8 w-8 text-[#f0f6fc]"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                     >
                        <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002Z" />
                     </svg>
                  </div>
                  <h1 className="text-2xl font-semibold text-[#f0f6fc]">
                     VatTours
                  </h1>
                  <p className="mt-2 text-sm text-[#7d8590]">
                     Faça login para acessar o VatTours
                  </p>
               </div>

               <button
                  onClick={() => signIn('vatsim', { callbackUrl: '/' })}
                  className="w-full cursor-pointer rounded-md bg-[#238636] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2ea043] focus:ring-2 focus:ring-[#238636] focus:ring-offset-2 focus:ring-offset-[#010409] focus:outline-none"
               >
                  <div className="flex items-center justify-center gap-3">
                     <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                     >
                        <path
                           fillRule="evenodd"
                           d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                           clipRule="evenodd"
                        />
                     </svg>
                     Entrar com VATSIM
                  </div>
               </button>
            </div>
         </div>
      </div>
   );
}
