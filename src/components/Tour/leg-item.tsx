'use client';

import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

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
      <div
         className={`rounded-md border p-4 transition-colors ${
            highlight
               ? 'border-[#7d8590] bg-[#161b22]'
               : 'border-[#21262d] bg-[#161b22] hover:bg-[#21262d]'
         }`}
      >
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                     highlight
                        ? 'bg-[#7d8590] text-[#f0f6fc]'
                        : 'bg-[#21262d] text-[#f0f6fc]'
                  }`}
               >
                  {index + 1}
               </div>
               <span className="text-sm text-[#7d8590]">Etapa {index + 1}</span>
            </div>
            {leg.description && (
               <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center gap-2 rounded-md border border-[#21262d] bg-[#0d1117] px-3 py-1 text-sm text-[#f0f6fc] transition-colors hover:bg-[#21262d]"
               >
                  <span>{showDescription ? 'Esconder' : 'Detalhes'}</span>
                  <ChevronDown
                     className={`h-4 w-4 transition-transform ${
                        showDescription ? 'rotate-180' : ''
                     }`}
                  />
               </button>
            )}
         </div>

         <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
               <span
                  className={`fi fi-${leg.departureCountry.toLowerCase()} h-4 w-6 rounded border border-[#21262d]`}
               ></span>
               <span className="font-mono text-lg font-medium text-[#f0f6fc]">
                  {leg.departureIcao}
               </span>
            </div>

            <div className="flex items-center gap-2">
               <div className="h-px w-6 bg-[#21262d]"></div>
               <ArrowRight className="h-4 w-4 text-[#7d8590]" />
               <div className="h-px w-6 bg-[#21262d]"></div>
            </div>

            <div className="flex items-center gap-2">
               <span className="font-mono text-lg font-medium text-[#f0f6fc]">
                  {leg.arrivalIcao}
               </span>
               <span
                  className={`fi fi-${leg.arrivalCountry.toLowerCase()} h-4 w-6 rounded border border-[#21262d]`}
               ></span>
            </div>
         </div>

         {showDescription && leg.description && (
            <div className="mt-4 rounded-md border border-[#21262d] bg-[#0d1117] p-4">
               <h4 className="mb-2 text-sm font-medium text-[#f0f6fc]">
                  Detalhes da Rota
               </h4>
               <p className="text-sm leading-relaxed text-[#7d8590]">
                  {leg.description}
               </p>
            </div>
         )}
      </div>
   );
}
