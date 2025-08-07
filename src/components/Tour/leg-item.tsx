'use client';

import { useState } from 'react';

type Leg = {
   id: number;
   departureCountry: string;
   departureIcao: string;
   arrivalCountry: string;
   arrivalIcao: string;
   description: string | null;
};

export default function LegItem({
   leg,
   index,
   highlight = false,
}: {
   leg: Leg;
   index: number;
   highlight?: boolean;
}) {
   const [showDescription, setShowDescription] = useState(false);

   return (
      <li
         className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] ${
            highlight
               ? 'border-cyan-400/50 bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 shadow-xl shadow-cyan-500/20'
               : 'border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10'
         }`}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
         {highlight && (
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-cyan-400"></div>
         )}

         <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
               <div className="flex items-center gap-3">
                  <div
                     className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold ${
                        highlight
                           ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white'
                           : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                     }`}
                  >
                     {index + 1}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                     Etapa {index + 1}
                  </span>
               </div>
               {leg.description && (
                  <button
                     onClick={() => setShowDescription(!showDescription)}
                     className="group/btn flex items-center justify-center sm:justify-start gap-2 rounded-full bg-blue-600/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-400 transition-all hover:bg-blue-600/30 hover:text-blue-300 w-full sm:w-auto"
                  >
                     <span className="hidden sm:inline">
                        {showDescription
                           ? 'Esconder detalhes'
                           : 'Mostrar detalhes'}
                     </span>
                     <span className="sm:hidden">
                        {showDescription ? 'Esconder' : 'Detalhes'}
                     </span>
                     <svg
                        className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 ${showDescription ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M19 9l-7 7-7-7"
                        />
                     </svg>
                  </button>
               )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-lg sm:text-xl lg:text-2xl font-bold">
               <div className="flex items-center gap-2 sm:gap-3">
                  <span
                     className={`fi fi-${leg.departureCountry.toLowerCase()} h-5 w-6 sm:h-6 sm:w-8 rounded border border-gray-600 shadow-sm`}
                  ></span>
                  <span className="text-white text-base sm:text-lg lg:text-xl">{leg.departureIcao}</span>
               </div>

               <div className="flex items-center gap-1 sm:gap-2">
                  <div className="h-px w-4 sm:w-6 lg:w-8 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 sm:p-2">
                     <svg
                        className="h-3 w-3 sm:h-4 sm:w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                     >
                        <path
                           fillRule="evenodd"
                           d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
                  <div className="h-px w-4 sm:w-6 lg:w-8 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
               </div>

               <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-white text-base sm:text-lg lg:text-xl">{leg.arrivalIcao}</span>
                  <span
                     className={`fi fi-${leg.arrivalCountry.toLowerCase()} h-5 w-6 sm:h-6 sm:w-8 rounded border border-gray-600 shadow-sm`}
                  ></span>
               </div>
            </div>

            {showDescription && leg.description && (
               <div className="mt-6 sm:mt-8 overflow-hidden rounded-lg sm:rounded-xl border border-gray-700/50 bg-gray-800/50 p-4 sm:p-6 backdrop-blur-sm">
                  <h4 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-blue-400">
                     Detalhes da Rota
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed text-gray-300">
                     {leg.description}
                  </p>
               </div>
            )}
         </div>
      </li>
   );
}
