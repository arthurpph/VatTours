'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SignIn() {
   const { status } = useSession();

   if (status === 'authenticated') {
      return redirect('/');
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-800 px-4">
         <div className="bg-opacity-80 flex w-full max-w-md flex-col items-center gap-10 rounded-xl bg-gray-900 p-10 shadow-lg backdrop-blur-md">
            <h1 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-md">
               VATtours
            </h1>

            <button
               className="flex h-14 w-full items-center justify-center rounded-lg bg-blue-600 text-lg font-semibold text-white shadow-md transition-colors duration-300 select-none hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none active:bg-blue-800"
               onClick={() => signIn('vatsim', { callbackUrl: '/' })}
               aria-label="Entrar com VATSIM"
            >
               Entrar com VATSIM
            </button>

            <p className="text-center text-sm text-gray-400">
               Faça login usando sua conta VATSIM para acessar o VATtours.
            </p>
         </div>
      </div>
   );
}
