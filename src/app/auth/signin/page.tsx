'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SignIn() {
   const { status } = useSession();

   if (status === 'authenticated') {
      return redirect('/');
   }

   return (
      <div className="bg-gradient-to-tr from-gray-900 via-black to-gray-800 min-h-screen flex justify-center items-center px-4">
         <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl w-full max-w-md p-10 flex flex-col items-center gap-10">
            <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-md">
               VATtours
            </h1>

            <button
               className="
            bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
            transition-colors duration-300 
            h-14 w-full rounded-lg 
            text-white text-lg font-semibold 
            shadow-md 
            flex items-center justify-center
            focus:outline-none focus:ring-4 focus:ring-blue-400
            select-none
            "
               onClick={() => signIn('vatsim', { callbackUrl: '/' })}
               aria-label="Entrar com VATSIM"
            >
               Entrar com VATSIM
            </button>

            <p className="text-gray-400 text-center text-sm">
               Faça login usando sua conta VATSIM para acessar o VATtours.
            </p>
         </div>
      </div>
   );
}
