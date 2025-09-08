import { db } from '@/lib/db';
import { toursTable } from '@/lib/db/schema';
import { isValidBase64Image } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { MapPin, AlertTriangle } from 'lucide-react';

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

   return (
      <div className="space-y-6">
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
               {tour.image && isValidBase64Image(tour.image) ? (
                  <div className="aspect-video overflow-hidden rounded-md border border-[#21262d] bg-[#0d1117]">
                     <Image
                        src={`data:image/jpeg;base64,${tour.image}`}
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

            <div className="space-y-4">
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
      </div>
   );
}
