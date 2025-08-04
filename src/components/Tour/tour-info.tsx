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
         <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <p className="text-white text-xl">Tour não encontrado.</p>
         </div>
      );
   }

   return (
      <section className="flex items-center justify-center">
         <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden rounded-xl shadow-md">
               {isValidUrl(tour.image) ? (
                  <Image
                     src={`${tour.image}`}
                     alt={tour.title}
                     width={1000}
                     height={1000}
                     className="w-full h-full object-cover rounded-xl max-h-[500px]"
                  />
               ) : (
                  <div className="w-full h-100 bg-gray-700 flex items-center justify-center">
                     <p className="text-gray-400">Imagem inválida</p>
                  </div>
               )}
            </div>
            <div className="space-y-10 text-white">
               <div className="text-left space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                     {tour.title}
                  </h1>
               </div>

               <div className="prose prose-invert max-w-none text-lg leading-relaxed text-gray-300">
                  <p>{tour.description}</p>
               </div>
            </div>
         </div>
      </section>
   );
}
