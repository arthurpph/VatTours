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
               ? 'from-cyan-900 to-cyan-800 border-cyan-500 shadow-lg'
               : 'from-gray-900 to-gray-800 border-gray-700'
         } border p-6 rounded-xl transition-shadow duration-300`}
      >
         <div className="flex items-center justify-between mb-4">
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

         <div className="text-xl font-semibold flex items-center gap-2">
            <span
               className={`fi fi-${leg.departureCountry.toLowerCase()} w-5 h-4`}
            ></span>
            {leg.departureIcao}
            <span className="mx-2 text-gray-500">→</span>
            <span
               className={`fi fi-${leg.arrivalCountry.toLowerCase()} w-5 h-4`}
            ></span>
            {leg.arrivalIcao}
         </div>

         {showDescription && leg.description && (
            <p className="text-gray-300 text-sm leading-relaxed mt-4 border-t border-gray-700 pt-3">
               {leg.description}
            </p>
         )}
      </li>
   );
}
