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
         <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <p className="text-xl text-white">Tour não encontrado.</p>
         </div>
      );
   }

   return (
      <section className="flex items-center justify-center">
         <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl shadow-md">
               {isValidUrl(tour.image) ? (
                  <Image
                     src={`${tour.image}`}
                     alt={tour.title}
                     width={1000}
                     height={1000}
                     className="h-full max-h-[500px] w-full rounded-xl object-cover"
                  />
               ) : (
                  <div className="flex h-100 w-full items-center justify-center bg-gray-700">
                     <p className="text-gray-400">Imagem inválida</p>
                  </div>
               )}
            </div>
            <div className="space-y-10 text-white">
               <div className="space-y-4 text-left">
                  <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
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
