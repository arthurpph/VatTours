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
         <div className="flex min-h-screen items-center justify-center px-4">
            <div className="space-y-6 text-center">
               <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500">
                  <svg
                     className="h-12 w-12 text-white"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                     />
                  </svg>
               </div>
               <h2 className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent">
                  Tour não encontrado
               </h2>
               <p className="max-w-md text-gray-400">
                  O tour que você está procurando não existe ou foi removido.
               </p>
            </div>
         </div>
      );
   }

   return (
      <section className="relative w-full">
         <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-gradient-to-br from-purple-600/10 to-indigo-600/10 blur-3xl"></div>
         </div>

         <div className="relative mx-auto max-w-7xl px-4 py-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
               <div className="group relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
                  <div className="relative overflow-hidden rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
                     {isValidUrl(tour.image) ? (
                        <Image
                           src={tour.image}
                           alt={tour.title}
                           width={1000}
                           height={1000}
                           className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                           style={{ maxHeight: '600px', height: '100%' }}
                           priority
                        />
                     ) : (
                        <div className="flex h-[300px] w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 sm:h-[400px] lg:h-[600px]">
                           <div className="space-y-4 text-center">
                              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                                 <svg
                                    className="h-8 w-8 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                              </div>
                              <p className="font-medium text-gray-400">
                                 Imagem não disponível
                              </p>
                           </div>
                        </div>
                     )}

                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
               </div>

               <div className="flex flex-col justify-center space-y-10">
                  <div className="space-y-6">
                     <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-5xl leading-tight font-bold text-transparent sm:text-6xl lg:text-7xl">
                        {tour.title}
                     </h1>

                     <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  </div>

                  <div className="space-y-6">
                     <p className="text-xl leading-relaxed font-light text-gray-300 sm:text-2xl lg:text-3xl">
                        {tour.description}
                     </p>

                     <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-blue-700/10 p-6">
                           <div className="mb-2 flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                              <span className="font-medium text-blue-400">
                                 Status
                              </span>
                           </div>
                           <p className="text-gray-300">Tour Ativo</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
