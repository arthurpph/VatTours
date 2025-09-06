import { db } from '@/lib/db';
import { toursTable, legsTable } from '@/lib/db/schema';
import { isValidUrl } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { MapPin, Calendar, Route, AlertTriangle } from 'lucide-react';
import { Leg } from '@/models/types';

type Props = {
   tourId: string;
};

export default async function TourInfo({ tourId }: Props) {
   const tour = await db.query.toursTable.findFirst({
      where: eq(toursTable.id, Number(tourId)),
   });

   if (!tour) {
      return (
         <div className="flex min-h-screen items-center justify-center px-4">
            <div className="space-y-6 text-center">
               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#da3633]/20">
                  <AlertTriangle className="h-8 w-8 text-[#da3633]" />
               </div>
               <h2 className="text-2xl font-semibold text-[#f0f6fc]">
                  Tour não encontrado
               </h2>
               <p className="max-w-md text-[#7d8590]">
                  O tour que você está procurando não existe ou foi removido.
               </p>
            </div>
         </div>
      );
   }

   const legs = await db.query.legsTable.findMany({
      where: eq(legsTable.tourId, Number(tourId)),
   });

   return (
      <div className="space-y-6">
         {/* Tour Header */}
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
               {/* Tour Image */}
               {tour.image && isValidUrl(tour.image) ? (
                  <div className="aspect-video overflow-hidden rounded-md border border-[#21262d] bg-[#0d1117]">
                     <Image
                        src={tour.image}
                        alt={tour.title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover"
                        priority
                     />
                  </div>
               ) : (
                  <div className="flex aspect-video items-center justify-center rounded-md border border-[#21262d] bg-[#0d1117]">
                     <div className="text-center">
                        <MapPin className="mx-auto h-12 w-12 text-[#21262d]" />
                        <p className="mt-2 text-sm text-[#7d8590]">
                           Imagem não disponível
                        </p>
                     </div>
                  </div>
               )}

               {/* Tour Title and Description */}
               <div className="mt-6">
                  <h1 className="text-3xl font-semibold text-[#f0f6fc] lg:text-4xl">
                     {tour.title}
                  </h1>
                  <div className="mt-2 h-0.5 w-16 rounded-full bg-[#2f81f7]"></div>
                  <p className="mt-4 leading-relaxed text-[#7d8590]">
                     {tour.description}
                  </p>
               </div>
            </div>

            {/* Tour Stats Sidebar */}
            <div className="space-y-4">
               <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                  <div className="mb-3 flex items-center gap-2">
                     <Route className="h-5 w-5 text-[#2f81f7]" />
                     <h3 className="font-medium text-[#f0f6fc]">
                        Estatísticas
                     </h3>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-[#7d8590]">Etapas:</span>
                        <span className="font-medium text-[#f0f6fc]">
                           {legs.length}
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-[#7d8590]">Status:</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#238636]/10 px-2 py-1 text-xs text-[#238636]">
                           <div className="h-2 w-2 rounded-full bg-[#238636]"></div>
                           Ativo
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-[#7d8590]">
                           Dificuldade:
                        </span>
                        <span className="text-sm font-medium text-[#f0f6fc]">
                           Intermediário
                        </span>
                     </div>
                  </div>
               </div>

               <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                  <div className="mb-3 flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-[#8b5cf6]" />
                     <h3 className="font-medium text-[#f0f6fc]">Progresso</h3>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-[#7d8590]">
                           Concluído:
                        </span>
                        <span className="font-medium text-[#f0f6fc]">0%</span>
                     </div>
                     <div className="h-2 overflow-hidden rounded-full bg-[#21262d]">
                        <div className="h-full w-0 rounded-full bg-[#2f81f7] transition-all duration-300"></div>
                     </div>
                     <p className="text-xs text-[#7d8590]">
                        Você ainda não iniciou este tour
                     </p>
                  </div>
               </div>

               <div className="rounded-md border border-[#21262d] bg-[#161b22] p-4">
                  <h3 className="mb-3 font-medium text-[#f0f6fc]">
                     Badges Disponíveis
                  </h3>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffd700]/20">
                           <div className="h-3 w-3 rounded-full bg-[#ffd700]"></div>
                        </div>
                        <span className="text-sm text-[#7d8590]">
                           Explorador
                        </span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#238636]/20">
                           <div className="h-3 w-3 rounded-full bg-[#238636]"></div>
                        </div>
                        <span className="text-sm text-[#7d8590]">
                           Aventureiro
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Tour Legs */}
         <div className="rounded-md border border-[#21262d] bg-[#161b22] p-6">
            <h2 className="mb-4 text-xl font-semibold text-[#f0f6fc]">
               Etapas do Tour
            </h2>
            <div className="space-y-3">
               {legs.map((leg: Leg, index: number) => (
                  <div
                     key={index}
                     className="flex items-center gap-4 rounded-md border border-[#21262d] bg-[#0d1117] p-4 transition-colors hover:bg-[#21262d]"
                  >
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2f81f7]/20 text-sm font-medium text-[#2f81f7]">
                        {index + 1}
                     </div>
                     <div className="flex-1">
                        <p className="font-medium text-[#f0f6fc]">
                           {leg.description}
                        </p>
                        <p className="text-sm text-[#7d8590]">
                           {leg.departureIcao} → {leg.arrivalIcao}
                        </p>
                     </div>
                     <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#21262d] px-2 py-1 text-xs text-[#7d8590]">
                           <div className="h-2 w-2 rounded-full bg-[#7d8590]"></div>
                           Pendente
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
