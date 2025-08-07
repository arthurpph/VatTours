'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SignIn() {
   const { status } = useSession();

   if (status === 'authenticated') {
      return redirect('/');
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#334155] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-0">
         <div className="flex w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-700 bg-gray-900/90 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 shadow-2xl backdrop-blur-md">
            <div
               className="relative h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-60 lg:w-60 xl:h-72 xl:w-72 2xl:h-80 2xl:w-80 rounded-full p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8 shadow-2xl ring-2 sm:ring-2 md:ring-3 lg:ring-3 xl:ring-4 2xl:ring-4 ring-blue-500/60 transition-transform duration-500 hover:scale-105"
               style={{
                  background:
                     'radial-gradient(circle at center, rgba(59, 130, 246, 0.3), transparent 70%)',
               }}
            >
               <svg
                  className="w-full h-full"
                  viewBox="0 0 320 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="VATtours Logo"
                  role="img"
                  preserveAspectRatio="xMidYMid meet"
               >
                  <defs>
                     <linearGradient
                        id="grad1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                     >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                     </linearGradient>
                     <filter
                        id="glow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                        colorInterpolationFilters="sRGB"
                     >
                        <feDropShadow
                           dx="0"
                           dy="0"
                           stdDeviation="8"
                           floodColor="#8b5cf6"
                           floodOpacity="0.6"
                        />
                        <feDropShadow
                           dx="0"
                           dy="0"
                           stdDeviation="4"
                           floodColor="#3b82f6"
                           floodOpacity="0.8"
                        />
                     </filter>
                  </defs>

                  <circle
                     cx="160"
                     cy="160"
                     r="120"
                     stroke="url(#grad1)"
                     strokeWidth="10"
                     fill="none"
                     filter="url(#glow)"
                  />

                  <path
                     d="M 80 100 C 140 60 180 260 240 140"
                     stroke="url(#grad1)"
                     strokeWidth="8"
                     strokeLinecap="round"
                     fill="none"
                     filter="url(#glow)"
                  />

                  <path
                     d="M 110 200 C 140 140 180 220 210 160"
                     stroke="url(#grad1)"
                     strokeWidth="6"
                     strokeLinecap="round"
                     fill="none"
                     filter="url(#glow)"
                  />

                  <circle
                     cx="80"
                     cy="100"
                     r="8"
                     fill="#8b5cf6"
                     filter="url(#glow)"
                  />
                  <circle
                     cx="240"
                     cy="140"
                     r="8"
                     fill="#3b82f6"
                     filter="url(#glow)"
                  />
                  <circle
                     cx="210"
                     cy="160"
                     r="6"
                     fill="#a78bfa"
                     filter="url(#glow)"
                  />
                  <circle
                     cx="110"
                     cy="200"
                     r="6"
                     fill="#60a5fa"
                     filter="url(#glow)"
                  />
               </svg>
            </div>

            <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-transparent drop-shadow-lg select-none text-center leading-tight">
               VatTours
            </h1>

            <button
               className="flex h-10 sm:h-11 md:h-12 lg:h-13 xl:h-14 2xl:h-16 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transform cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-white shadow-lg transition duration-200 select-none hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-400 focus:outline-none active:scale-95"
               onClick={() => signIn('vatsim', { callbackUrl: '/' })}
               aria-label="Entrar com VATSIM"
            >
               Entrar com VATSIM
            </button>

            <p className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-gray-300 select-none px-2">
               Faça login usando sua conta VATSIM para acessar o VatTours.
            </p>
         </div>
      </div>
   );
}
