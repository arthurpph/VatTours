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
         className={`bg-gradient-to-r ${
            highlight
               ? 'border-cyan-500 from-cyan-900 to-cyan-800 shadow-lg'
               : 'border-gray-700 from-gray-900 to-gray-800'
         } rounded-xl border p-6 transition-shadow duration-300`}
      >
         <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Etapa {index + 1}</div>
            {leg.description && (
               <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-sm text-blue-400 hover:underline focus:outline-none"
               >
                  {showDescription ? 'Esconder detalhes' : 'Mostrar detalhes'}
               </button>
            )}
         </div>

         <div className="flex items-center gap-2 text-xl font-semibold">
            <span
               className={`fi fi-${leg.departureCountry.toLowerCase()} h-4 w-5`}
            ></span>
            {leg.departureIcao}
            <span className="mx-2 text-gray-500">→</span>
            <span
               className={`fi fi-${leg.arrivalCountry.toLowerCase()} h-4 w-5`}
            ></span>
            {leg.arrivalIcao}
         </div>

         {showDescription && leg.description && (
            <p className="mt-4 border-t border-gray-700 pt-3 text-sm leading-relaxed text-gray-300">
               {leg.description}
            </p>
         )}
      </li>
   );
}
