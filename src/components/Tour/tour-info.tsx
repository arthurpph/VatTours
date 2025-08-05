import { db } from '@/lib/db';
import { toursTable } from '@/lib/db/schema';
import { isValidUrl } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import Image from 'next/image';

type Props = {
   tourId: string;
};

export default async function TourInfo({ tourId }: Props) {
   const tour = await db.query.toursTable.findFirst({
      where: eq(toursTable.id, Number(tourId)),
   });

   if (!tour) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <p className="text-xl text-white">Tour não encontrado.</p>
         </div>
      );
   }

   return (
      <section className="flex items-center justify-center px-4 py-12">
         <div className="grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-xl shadow-md lg:h-auto">
               {isValidUrl(tour.image) ? (
                  <Image
                     src={tour.image}
                     alt={tour.title}
                     width={1000}
                     height={1000}
                     className="w-full rounded-xl object-cover"
                     style={{ maxHeight: '600px', height: '100%' }}
                     priority
                  />
               ) : (
                  <div className="flex h-[300px] w-full items-center justify-center rounded-xl bg-gray-700 sm:h-[400px] lg:h-[600px]">
                     <p className="text-gray-400">Imagem inválida</p>
                  </div>
               )}
            </div>

            <div className="flex flex-col justify-center space-y-8 text-white">
               <div className="text-left">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                     {tour.title}
                  </h1>
               </div>

               <div className="prose prose-invert max-w-none text-lg leading-relaxed text-gray-300 sm:text-xl lg:text-2xl">
                  <p>{tour.description}</p>
               </div>
            </div>
         </div>
      </section>
   );
}
