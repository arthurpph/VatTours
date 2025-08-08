'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SignIn() {
   const { status } = useSession();

   if (status === 'authenticated') {
      return redirect('/');
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-black via-gray-950 to-gray-900 px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-0 lg:px-12 xl:px-16">
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="animate-pulse-slow absolute top-20 right-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 blur-3xl"></div>
            <div className="animate-pulse-slow absolute bottom-40 left-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 blur-3xl delay-1000"></div>
            <div className="animate-float absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-blue-900/5"></div>
         </div>

         <div className="glass relative flex w-full max-w-xs flex-col items-center gap-6 rounded-xl border border-gray-800/50 bg-black/95 p-6 shadow-2xl backdrop-blur-md sm:max-w-sm sm:gap-8 sm:rounded-2xl sm:p-8 md:max-w-md md:gap-10 md:p-10 lg:max-w-lg lg:gap-12 lg:rounded-3xl lg:p-12 xl:max-w-xl xl:gap-14 xl:p-14 2xl:max-w-2xl 2xl:gap-16 2xl:p-16">
            <div
               className="group animate-float relative h-32 w-32 rounded-full p-2 shadow-2xl ring-2 ring-blue-500/60 transition-all duration-500 hover:scale-110 hover:ring-4 hover:ring-blue-400/80 sm:h-40 sm:w-40 sm:p-3 sm:ring-2 md:h-48 md:w-48 md:p-4 md:ring-3 lg:h-60 lg:w-60 lg:p-5 lg:ring-3 xl:h-72 xl:w-72 xl:p-6 xl:ring-4 2xl:h-80 2xl:w-80 2xl:p-8 2xl:ring-4"
               style={{
                  background:
                     'radial-gradient(circle at center, rgba(59, 130, 246, 0.3), transparent 70%)',
               }}
            >
               <svg
                  className="h-full w-full"
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

            <h1 className="animate-float bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-center text-xl leading-tight font-extrabold text-transparent drop-shadow-lg select-none sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
               VatTours
            </h1>

            <div className="w-full space-y-6">
               <button
                  className="group relative flex h-12 w-full transform cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg transition-all duration-300 select-none hover:scale-105 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 focus:ring-4 focus:ring-indigo-400 focus:outline-none active:scale-95 sm:h-13 sm:text-base md:h-14 md:text-lg lg:h-15 lg:text-xl xl:h-16 xl:text-xl 2xl:h-18 2xl:text-2xl"
                  onClick={() => signIn('vatsim', { callbackUrl: '/' })}
                  aria-label="Entrar com VATSIM"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  <span className="relative z-10 flex items-center gap-3">
                     <svg
                        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
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
                     <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                     </svg>
                  </span>

                  <div className="animate-glow absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur"></div>
               </button>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                     <span className="bg-black/95 px-4 text-gray-400">
                        Acesso seguro
                     </span>
                  </div>
               </div>
            </div>

            <div className="space-y-4 text-center">
               <p className="max-w-xs px-2 text-center text-xs leading-relaxed text-gray-300 select-none sm:max-w-sm sm:text-sm md:max-w-md md:text-base lg:max-w-lg lg:text-lg">
                  Faça login usando sua conta VATSIM para acessar o VatTours e
                  começar sua jornada pelos céus.
               </p>

               <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                     <svg
                        className="h-3 w-3 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                     >
                        <path
                           fillRule="evenodd"
                           d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                           clipRule="evenodd"
                        />
                     </svg>
                     <span>Seguro</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <svg
                        className="h-3 w-3 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                     >
                        <path
                           fillRule="evenodd"
                           d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                           clipRule="evenodd"
                        />
                     </svg>
                     <span>Oficial VATSIM</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
