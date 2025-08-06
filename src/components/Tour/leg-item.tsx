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
         className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${
            highlight
               ? 'border-cyan-400/50 bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 shadow-xl shadow-cyan-500/20'
               : 'border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10'
         }`}
      >
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
         {highlight && (
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-cyan-400"></div>
         )}

         <div className="relative p-8">
            <div className="mb-6 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div
                     className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        highlight
                           ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white'
                           : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                     }`}
                  >
                     {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                     Etapa {index + 1}
                  </span>
               </div>
               {leg.description && (
                  <button
                     onClick={() => setShowDescription(!showDescription)}
                     className="group/btn flex items-center gap-2 rounded-full bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-600/30 hover:text-blue-300"
                  >
                     {showDescription
                        ? 'Esconder detalhes'
                        : 'Mostrar detalhes'}
                     <svg
                        className={`h-4 w-4 transition-transform duration-300 ${showDescription ? 'rotate-180' : ''}`}
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

            <div className="flex items-center justify-center gap-6 text-2xl font-bold">
               <div className="flex items-center gap-3">
                  <span
                     className={`fi fi-${leg.departureCountry.toLowerCase()} h-6 w-8 rounded border border-gray-600 shadow-sm`}
                  ></span>
                  <span className="text-white">{leg.departureIcao}</span>
               </div>

               <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-2">
                     <svg
                        className="h-4 w-4 text-white"
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
                  <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
               </div>

               <div className="flex items-center gap-3">
                  <span className="text-white">{leg.arrivalIcao}</span>
                  <span
                     className={`fi fi-${leg.arrivalCountry.toLowerCase()} h-6 w-8 rounded border border-gray-600 shadow-sm`}
                  ></span>
               </div>
            </div>

            {showDescription && leg.description && (
               <div className="mt-8 overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm">
                  <h4 className="mb-3 font-semibold text-blue-400">
                     Detalhes da Rota
                  </h4>
                  <p className="leading-relaxed text-gray-300">
                     {leg.description}
                  </p>
               </div>
            )}
         </div>
      </li>
   );
}
